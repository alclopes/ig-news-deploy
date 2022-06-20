// exemplo02 de operação/api backend em nextJs (pegando o ID na URL)
// tags: #NextBackEnd#
// para testar é so colocar no browser: https://localhost:3000/api/exemplo/id

import { NextApiRequest, NextApiResponse } from 'next'

export default function handler( request: NextApiRequest, response: NextApiResponse) {

  console.log(request.query) //retorna o id que estava na url

  const users = [
    { id: 1, name: 'Diego'},
    { id: 2, name: 'Dani'},
    { id: 3, name: 'Rafa'},
  ]
   return response.status(200).json(users)
}