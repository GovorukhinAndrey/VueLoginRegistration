import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://demo.book24.ru/api/v1',
  headers: {
    Authorization: `Basic ZGVtby5ib29rMjQ6Ym9vazI0`,
    'X-TOKEN': '330d207892855dbd5abd5147ea562094',
  },
});

export default instance;
