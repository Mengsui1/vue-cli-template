import axios from 'axios';
const AXIOS_CONFIG = {
  timeout: 10 * 1000,
  withCredentials: true,
  baseURL: 'https://api.j.h5no1.cn/s/api'
};

const newShortLinkApi = ({ url, token, withTimestamp = true } = {}) => {
  if (!url || typeof url !== 'string') {
    return Promise.reject('检查 [url] 参数');
  }
  if (!token || typeof token !== 'string') {
    return Promise.reject('检查 [token] 参数');
  }
  if (typeof withTimestamp !== 'boolean') {
    return Promise.reject('检查 [withTimestamp] 参数');
  }
  let params = {
    url,
    token
  };
  return new Promise((resolve, reject) => {
    axios
      .post(`/client/link/create`, params, { ...AXIOS_CONFIG })
      .then(res => {
        if (res.data && res.data.ok === true) {
          const { short_link } = res.data.result;
          resolve(withTimestamp ? `${short_link}/${Date.now()}` : short_link);
        } else {
          reject(res);
        }
      })
      .catch(reject);
  });
};

export default newShortLinkApi;
