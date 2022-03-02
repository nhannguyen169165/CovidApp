import axios, { AxiosError, AxiosResponse } from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

let store;
export const injectStore = (_store:any) => {
  store = _store;
};
const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

// axios.interceptors.request.use((config) => {
//   return config;
// });

axios.interceptors.response.use(async response => {
  if (process.env.NODE_ENV === 'development') await sleep();
  return response
}, (error: AxiosError) => {
  console.log(error.response);
  return Promise.reject(error.response);
})

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody)
}

const Country = {
  list: () => requests.get(`summary`)
}

const api = {
  Country
}

export default api;