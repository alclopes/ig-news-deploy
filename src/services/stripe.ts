// configuraação do stripe no backend (usa chave privada)

import Stripe from 'stripe';
import { version } from '../../package.json';

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: '2020-08-27',
    appInfo: {
      name: 'Ignews',
      version
    },
  }
);

/* 
Outra forma de importar sem desestruturar a propriedade do package.json:

import packageInfo from '../../package.json'
const { version } = packageInfo
*/