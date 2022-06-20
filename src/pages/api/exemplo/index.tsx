// exemplo01 de operação/api backend em nextJs
// tags: #NextBackEnd#
// para testar é so colocar no browser: https://localhost:3000/api/exemplo

import { NextApiRequest, NextApiResponse } from 'next'

export default function handler( request: NextApiRequest, response: NextApiResponse) {
  const users = [
    { id: 1, name: 'Diego'},
    { id: 2, name: 'Dani'},
    { id: 3, name: 'Rafa'},
  ]
   return response.status(200).json(users)
}