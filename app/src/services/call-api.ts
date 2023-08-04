import axios from 'src/services/axios.service';
import { call } from 'redux-saga/effects';
import { AxiosRequestConfig } from 'axios';

interface IAxiosService {
  url: string;
  headers?: AxiosRequestConfig;
}

// Axios service
const axiosService = (config: IAxiosService) => {
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
  }

  const url: string = config.url;
  if (!url) {
    throw new Error('Axios: Invalid URL');
  }

  // axios.defaults.baseURL = url.toLowerCase().startsWith('http') ? undefined : process.env.REACT_APP_API_URL_NEST;
  // axios.defaults.timeout = 60000; // 60sec
  // axios.defaults.withCredentials = false; // ถ้าใส่ true  แล้วจะติด Access-Control-Allow-Origin
  // axios.defaults.headers.Accept = '*/*';
  // axios.defaults.headers['Content-Type'] = 'application/json';

  // if (config.headers) {
  //   axios.defaults.headers = { ...axios.defaults.headers, ...config.headers };
  // }

  // const _axios = axios.create();
  // const time = `${Date.now()}`.substr(9);
  // _axios.interceptors.request.use((request) => {
  //   const { method, data } = request;
  //   console.log(`REQ:${time}`, { url, method, data });
  //   return request;
  // });
  // _axios.interceptors.response.use((response) => {
  //   const { status, statusText, data } = response;
  //   console.log(`RES:${time}`, { status, statusText, data });
  //   return response;
  // });
  return axios;
};

// --------- Get ---------
export const callGet = (url: string, params?: any, headers?: any) =>
  call(() =>
    axiosService({ url, headers })
      // .get(url, { params: params })
      .get(url)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response?.data || error;
      }),
  );

// --------- Post ---------
export const callPost = (url: string, data?: any, headers?: any) =>
  call(() =>
    axiosService({ url, headers })
      .post(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response?.data || error;
      }),
  );

// --------- Put ---------
export const callPut = (url: string, data?: any, headers?: any) =>
  call(() =>
    axiosService({ url, headers })
      .put(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response?.data || error;
      }),
  );

// --------- Patch ---------
export const callPatch = (url: string, data?: any, headers?: any) =>
  call(() =>
    axiosService({ url, headers })
      .patch(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response?.data || error;
      }),
  );

// --------- Delete ---------
export const callDelete = (url: string, data?:any) =>
  call(() =>
    axiosService({ url })
      .delete(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response?.data || error;
      }),
  );
