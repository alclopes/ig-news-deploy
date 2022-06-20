// tags: #CheckoutSession# #Subscribe#
// https://stripe.com/docs/api/checkout/sessions

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/client';
import { query as q } from 'faunadb';
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  }
  data: {
    stripe_customer_id: string;
  }
}

export default async (request: NextApiRequest, response: NextApiResponse) => {

   // Criação checkout session exige que seja feita atraves de um método post
  if(request.method === 'POST'){

    // Identificando o usuário para  a criação da checkout session 
    // Note que esta operação esta no serverNodeJs/backend então o cookieUser so fica disponivel via getSession
    const session = await getSession({ req: request });
    
    // recuperando o usuário no faunadb.
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    );

    // recuperando o idStripe no UserFauna
    let customerId = user.data.stripe_customer_id;

    // se o idStripe ainda não existir no Fauna criar o user no stripe.
    if(!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      });
  
      // salvando o idUsuárioStripe no UsuarioFaunadb 
      // Desta forma em um segundo momento teremos como comparar se o usuário já existirá no fauna se sim: tambem exite no stripe.
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: { 
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      )

      customerId = stripeCustomer.id;
    }


    // Efetivando a criação da checkout session para o usuário
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      // billing_address_collection: 'required',
      billing_address_collection: 'auto',
      line_items: [
        {price: 'price_1JeeliCj1ESGPp0cjtEATLCc', quantity: 1}
      ],
      // 202109 => 'price_1JeeliCj1ESGPp0cjtEATLCc' => orindo do id do PRICE no stripe. #idPrice#
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return response.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).send('Method not allowed');
  }
}