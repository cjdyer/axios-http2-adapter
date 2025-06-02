import { expectType } from 'tsd';
import axios, { AxiosAdapter, AxiosRequestConfig } from 'axios';
import createHTTP2Adapter, { HTTP2AdapterConfig } from './index';

expectType<AxiosAdapter>(createHTTP2Adapter());

expectType<AxiosAdapter>(createHTTP2Adapter({ force: true }));
expectType<AxiosAdapter>(createHTTP2Adapter({ agent: undefined }));

const config: HTTP2AdapterConfig = {
  force: false,
  agent: undefined,
};

expectType<AxiosAdapter>(createHTTP2Adapter(config));

const adapter = createHTTP2Adapter();
const requestConfig: AxiosRequestConfig = {
  url: 'https://example.com',
  adapter,
};

axios(requestConfig);
