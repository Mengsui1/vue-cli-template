import instance from './index';

const api = {
  getUserInfo: () => {
    return instance.get('user/info');
  }
};
export default api;
