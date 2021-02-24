import axios from 'axios';
import config from './../config/index.js';
import qs from 'qs';
import mock from './mock';
const query = qs.parse(window.location.search.slice(1));
const baseURL = config.baseURL;
const instance = axios.create({
  baseURL: baseURL,
  timeout: 10 * 1000,
  withCredentials: true
});
// 添加请求拦截器
instance.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    const { data, config } = response;
    if (data && data.ok) {
      // 数据请求成功
      return response.data;
    } else {
      const { url, baseURL } = config;
      let msg = `${config.method}:${url.replace(baseURL, '')}=>${data.message}`;
      if (config.method === 'post') {
        msg += `::${config.data}`;
      }
      const error = Error(msg);
      error.type = 'api';
      return Promise.reject(error);
    }
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
if (query.mock) {
  mock(instance);
}
export default instance;
