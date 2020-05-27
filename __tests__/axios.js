/**
 * Author : @nadir93
 */
'use strict';

import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  //AxiosInstance,
  //AxiosAdapter,
  //Cancel,
  //CancelToken,
  //CancelTokenSource,
  //Canceler,
} from 'axios';

const config: AxiosRequestConfig = {
  url: '/user',
  method: 'get',
  baseURL: 'https://api.example.com/',
  //transformRequest: (data: any) => '{"foo":"bar"}',
  transformResponse: [
    // (data: any) => ({
    //   baz: 'qux',
    // }),
  ],
  headers: {
    'X-FOO': 'bar',
  },
  params: {
    id: 12345,
  },
  //paramsSerializer: (params: any) => 'id=12345',
  data: {
    foo: 'bar',
  },
  timeout: 10000,
  withCredentials: true,
  auth: {
    username: 'janedoe',
    password: 's00pers3cret',
  },
  responseType: 'json',
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  //onUploadProgress: (progressEvent: any) => {},
  //onDownloadProgress: (progressEvent: any) => {},
  maxContentLength: 2000,
  // maxBodyLength: 2000,
  validateStatus: (status: number) => status >= 200 && status < 300,
  maxRedirects: 5,
  proxy: {
    host: '127.0.0.1',
    port: 9000,
  },
  //cancelToken: new axios.CancelToken((cancel: Canceler) => {}),
};

const handleResponse = (response: AxiosResponse) => {
  console.log(response.data);
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.headers);
  console.log(response.config);
};

const handleError = (error: AxiosError) => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else {
    console.log(error.message);
  }
};

// test('request test', () => {
//   axios(config)
//     .then(handleResponse)
//     .catch(handleError);

//   // expect(() => {
//   //   score(items)
//   // }).toThrow('아이템이 없습니다.');
// });
