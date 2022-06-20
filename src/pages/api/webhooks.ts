//03 => Aceitando mais de um evento e recuperando as informações neles
//02 => Interpretando evento e exibindo no console os dados dentro dele.
//01 => verificando se os eventos já estão sendo recebidos.
// tags: #webhooksStripe#

import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";


// transformando o stream (dados em partes recebidos do stripe) em algo 
// entendivel o código é disponibilizado no proprio site do Stripe.
// serão obtidos os headers e corpo da requisição
async function buffer(readable: Readable){
  const chunks = [];

  for await (const chunk of readable){
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}


// como a requisição esta vindo como uma stream, temos que desabilitar o 
// formato padrão do next de recebimento do request.
export const config = {
  api: {
    bodyParser: false
  }
}

// setando quais eventos nos queremos ouvir/registrar 
const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export default async (request: NextApiRequest, response: NextApiResponse) => {

  // se o metodo não for post não será executado
  if(request.method === 'POST'){
    const buf = await buffer(request);
    const secret = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch(err) {
      return response.status(400).send(`Webhook error: ${err.message}`);
    }

    const { type } = event;

    if(relevantEvents.has(type)){
      try {
        // para cada tipo de evento ele irá fazer uma coisa diferente
        switch (type) {

          case 'customer.subscription.updated':
            // Pendente: ????
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            );
            break;
          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );
            break;
          default:
            throw new Error('Unhandled event.');
        }
      } catch (err) {
        return response.json({error: 'Webhook handler failed'});
      }
    }

    response.json({received: true});
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).send('Method not allowed');
  }
}