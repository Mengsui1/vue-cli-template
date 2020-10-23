import instance from './index';

const api = {
  getUserInfo: () => {
    return instance.get('user/info', { params: { searchText: 'John' } });
  }
};
export default api;
