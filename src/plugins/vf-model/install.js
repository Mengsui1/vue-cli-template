import { createVfModal } from './vf-modal';
// import 'vf-modal/dist/index.min.css';
import Vue from 'vue';
function initVfModel(config) {
  let models = {};
  Object.keys(config).forEach(key => {
    models[key] = [
      {
        component: config[key],
        containerClass: ''
      }
    ];
  });

  let instances = {};
  let cacheInstances = [];
  const $modal = createVfModal(Object.assign(models, {}), {}, cacheInstances);

  Vue.prototype.$modal = async function(...args) {
    const options = [...args][0];
    if (!options.awaitClose) {
      const { instance, type } = await $modal(...args);
      if (instances[options.type]) {
        instances[options.type].push(instance);
      } else {
        instances[options.type] = [instance];
      }
      return Promise.resolve({ instance, type });
    } else {
      return $modal(...args);
    }
  };

  // 配置了 awaitClose: false 的弹窗，才能使用hide方法
  Vue.prototype.$modal.hide = function({ type }) {
    const _instances = instances[type];
    if (_instances && _instances.length > 0) {
      _instances.forEach(instance => {
        instance.$destroy();
        if (document.body.contains(instance.$el))
          document.body.removeChild(instance.$el);
      });
    } else {
      console.log(`vf-mode的${type}实例不存在`);
    }
  };
  // 关闭所有弹窗
  Vue.prototype.$modal.removeAll = function() {
    console.log('cacheInstances', cacheInstances);
    const cacheInstancesCopy = [...cacheInstances];
    cacheInstancesCopy.forEach(item => {
      item.$destroy();
      console.log(
        'document.body.contains(item.$el)',
        document.body.contains(item.$el)
      );
      if (document.body.contains(item.$el)) {
        document.body.removeChild(item.$el);
      }
      cacheInstances.shift();
    });
  };
  // Vue.prototype.$HomePandaAni =
}
export default initVfModel;
