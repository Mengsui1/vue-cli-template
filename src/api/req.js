import instance from './index';

const req = {
  aget(options) {
    return new Promise((resolve, reject) => {
      instance
        .get(options.url, {
          params: {
            ...options.data
          }
        })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  post(options) {
    return new Promise((resolve, reject) => {
      instance
        .post(options.url, {
          ...options.data
        })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
export default req;
