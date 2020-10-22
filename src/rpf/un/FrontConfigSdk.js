import axios from 'axios';

const ajax = axios.create({
  timeout: 10 * 1000
});

function goToDemo() {
  const pathname = window.location.pathname;
  if (!/\/render\//.test(pathname)) {
    window.location.href = `https://apg-jump.h5no1.com/C_eFI6J?url=${encodeURIComponent(
      `https://demo.h5no1.com/render${pathname}${window.location.search}`
    )}`;
  }
}

const validEnvs = ['prod', 'test'];

class FrontConfigSdk {
  constructor({ id, env = 'test', apiHost = 'api' } = {}) {
    if (!id || typeof id !== 'number') {
      throw Error('id is required and should be number');
    }
    if (validEnvs.indexOf(env) === -1) {
      throw Error('env should be one of ' + JSON.stringify(validEnvs));
    }
    this.id = id;
    this.env = env;
    this.apiHost = apiHost;
  }
  getConfig() {
    return ajax
      .get(`https://${this.apiHost}.h5no1.com/front-config-go/api/config/h5`, {
        params: {
          id: this.id,
          env: this.env
        }
      })
      .then(res => {
        const { data } = res;
        if (data.ok) {
          const { result } = res.data;
          if (result.env === 'demo') {
            goToDemo();
          }
          return result;
        }
        throw Error(`获取配置失败：${JSON.stringify(data)}`);
      });
  }
}

export default FrontConfigSdk;
