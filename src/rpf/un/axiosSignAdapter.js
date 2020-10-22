import md5 from 'md5';

function sign(data, salt) {
  const _params = {
    ...data,
    salt
  };
  const str = Object.keys(_params)
    .filter(k => {
      return _params[k] != null;
    })
    .sort()
    .map(k => `${k}=${_params[k]}`)
    .join('&');
  return md5(str);
}

function axiosSignAdapter(
  axiosIns,
  salt,
  { confuseSalt = '_salt_', confuseUrls = [] } = {}
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

  axiosIns.interceptors.request.use(
    function (config) {
      const ts = Date.now();
      const rnd = Math.random();
      const xSignData = {
        ...config.data,
        ...config.params,
        timestamp: ts,
        nonce: rnd
      };

      config.headers['x-timestamp'] = ts;
      config.headers['x-nonce'] = rnd;
      config.headers['x-signature'] = sign(xSignData, salt);
      if (confuseUrls.indexOf(config.url) !== -1) {
        const confuseRnd = Math.random();
        config.headers['Cookle'] = `${document.cookie}|${confuseRnd}|${sign(
          {
            ...xSignData,
            nonce: confuseRnd
          },
          confuseSalt
        )}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
}

export default axiosSignAdapter;
