import MockAdapter from 'axios-mock-adapter';

const mockData = {
  // `on${Method}:${path}`: {}
  'onGet:/user/info': {
    ok: true,
    result: {
      nickname: 'nick'
    }
  }
};

function mock(ax) {
  const mo = new MockAdapter(ax, {
    delayResponse: 100
  });

  Object.keys(mockData)
    .reduce((mo, key) => {
      let [method, pathname] = key.split(':');
      // mo[method](pathname).reply(200, mockData[key]);
      mo[method](pathname).reply(config => {
        console.log('::mock::', method, pathname, config.data, mockData[key]);
        return [200, mockData[key]];
      });

      return mo;
    }, mo)
    .onAny()
    .passThrough();
}
export default mock;
