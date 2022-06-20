// Aqui fizemos a integração usando a interface para React (pois a do Nextjs ainda estava em beta. => ver em: https://prismic.io/docs)

import Prismic from '@prismicio/client';

export function  getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(
    process.env.PRISMIC_ENDPOINT,
    {
      req,
      accessToken: process.env.PRISMIC_ACCESS_TOKEN
    }
  )

  return prismic;
}