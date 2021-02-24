import md5 from 'md5';
import axios from 'axios';

const getTs = () => {
  return axios
    .get('https://api.h5no1.com/front-config-go/api/config/timestamp')
    .then(res => {
      return res.data.result;
    })
    .catch(err => {
      console.log('axiosSignAdapter', err);
    });
};

function sign(data) {
  const _params = {
    ...data
  };
  const str = Object.keys(_params)
    .filter(k => {
      return _params[k] !== undefined;
    })
    .sort()
    .map(
      k =>
        `${k}=${_params[k] instanceof Date ? _params[k].toJSON() : _params[k]}`
    )
    .join('&');
  return md5(str);
}

function axiosSignAdapter(
  axiosIns,
  salt,
  { confuseSalt = '_salt_', getToken } = {}
) {
  if (!axiosIns) {
    throw Error('axios instance is required');
  }
  if (typeof salt !== 'string') {
    throw Error('salt is required & should be string');
  }

  if (typeof confuseSalt !== 'string') {
    throw Error('confuseSalt is required & should be string');
  }

  if (typeof getToken !== 'function') {
    throw Error('getToken is required & should be function');
  }

  const tsProm = getTs().then(ts => {
    return ts - Date.now();
  });

  const tsPromFn = () => tsProm;

  axiosIns.interceptors.request.use(
    async function (config) {
      const token = await getToken();
      const serverTimeDiff = await tsPromFn();
      const ts = Date.now() + serverTimeDiff;
      const rnd = Math.random();
      let xSignData = {
        ...config.params,
        ...config.data,
        timestamp: ts,
        nonce: rnd,
        salt: salt
      };
      if (token) {
        xSignData.token = token;
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      config.headers['x-timestamp'] = ts;
      config.headers['x-nonce'] = rnd;
      config.headers['x-signature'] = sign(xSignData);
      const confuseRnd = Math.random();
      config.headers['Cookle'] = `${document.cookie}|${confuseRnd}|${sign({
        ...xSignData,
        nonce: confuseRnd,
        salt: confuseSalt
      })}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
}

export default axiosSignAdapter;
