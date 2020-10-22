import qs from 'qs';
import axios from 'axios';
const query = qs.parse(window.location.search.slice(1));
const HOST = 'https://api.h5no1.com/front-config-go/api';
// const HOST = 'https://test.h5no1.com/front-config-go/api';
const envName = {
  demo: 'demo',
  prod: 'prod',
  test: 'test'
};
let _data = {
  status: false
};
let _getConfig;
const ajax = axios.create({
  baseURL: HOST,
  timeout: 10000
});
class FrontConfigSdk {
  constructor({ id, env = 'prod' } = {}) {
    if (!id) {
      throw new Error('id is required');
    }
    if (typeof id !== 'number') {
      throw new Error('id must be number');
    }
    this.id = id;
    this.env = env;
    _getConfig = this._getConfig();
  }

  getConfig() {
    return _getConfig;
  }

  async _getConfig() {
    let res = {};
    try {
      res = await ajax
        .get('/config/h5', {
          params: { id: this.id, env: this.env, t: Date.now() }
        })
        .then(res => res.data);
    } catch (e) {
      return Promise.reject(e);
    }
    if (res.ok === true) {
      this._update(res.result);
      return Promise.resolve(res.result);
    } else {
      return Promise.reject(res);
    }
  }
  _update(data) {
    Object.assign(_data, data);
    _data.status = true;
    if (this._isDemo()) this._demo();
    if (this._isOffLine()) this._offLine();
  }
  _offLine() {
    let tip = document.createElement('div');
    tip.style.cssText = ` 
                          position:fixed;
                          top:0;
                          left:0;
                          width:100vw;
                          line-height:40px;
                          z-index:1000;
                          background-color:rgb(0, 0, 0,0.2);
                          color:#fff;
                          font-size:15px;
                          text-align:center;
                          vertical-align: middle;
                          `;
    tip.appendChild(document.createTextNode('项目已经下线'));
    document.body.appendChild(tip);
  }

  _demo() {
    let pathName = window.location.pathname;
    const passDemo = 'pass_demo';
    let isPass = this.getQuery(passDemo);
    //项目名、是否跳过
    if (!/\/render\//.test(pathName) && !isPass) {
      const arrPathName = window.location.pathname
        .split('/')
        .filter(item => item);
      const lastPathName = arrPathName[arrPathName.length - 1];

      window.location.href = `https://apg-jump.h5no1.com/C_eFI6J?url=${encodeURIComponent(
        `https://demo.h5no1.com/render/${lastPathName}/${window.location.search}`
      )}`;
    }
  }

  _isOffLine() {
    const { currentTime, endTime } = _data.conf;
    return +new Date(currentTime) > +new Date(endTime);
  }

  _isDemo() {
    const { env } = _data;
    return env === envName.demo;
  }

  // TODO:
  _verifyHost() {}

  isReady() {
    return this.status;
  }

  getQuery(key) {
    return query[key];
  }
}

export default FrontConfigSdk;
