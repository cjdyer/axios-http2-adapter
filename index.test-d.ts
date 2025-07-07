import { expectType } from 'tsd';
import axios, { AxiosAdapter, AxiosRequestConfig } from 'axios';
import http2Adapter from './index';

expectType<AxiosAdapter>(http2Adapter);

const requestConfig: AxiosRequestConfig = {
  url: 'https://example.com',
  adapter: http2Adapter,
};

axios(requestConfig);
