// neste caso instalamos o axios para comunicar o frontend com as API routes do tipo POST.

import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});