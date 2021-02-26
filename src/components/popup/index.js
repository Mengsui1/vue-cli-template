import Vue from 'vue';
import loadingVue from './test/test.vue';
// 和指令模式一样，创建实例构造器
const LoadingConstructor = Vue.extend(loadingVue);
// 定义变量，若使用的是全屏 loading 那就要保证全局的 loading 只有一个
let fullscreenLoading;
// 这里可以看到和指令模式不同的地方
// 在调用了 close 之后就会移除该元素并销毁组件
LoadingConstructor.prototype.close = function () {
  //   setTimeout(() => {
  if (this.$el && this.$el.parentNode) {
    this.$el.parentNode.removeChild(this.$el);
  }
  this.$destroy();
  //   }, 3000);
};

const popup = (options = {}) => {
  if (options.fullscreen && fullscreenLoading) {
    return fullscreenLoading;
  }
  // 这里就不用说了吧，和指令中是一样的
  let instance = new LoadingConstructor({
    el: document.createElement('div'),
    ...options
  });
  let parent = document.body;
  // 直接添加元素
  parent.appendChild(instance.$el);
  // 将其设置为可见

  Vue.nextTick(() => {
    instance.visible = true;
  });
  // 若传入了 fullscreen 参数，则将实例存储
  if (options.fullscreen) {
    fullscreenLoading = instance;
  }
  // 返回实例，方便之后能够调用原型上的 close() 方法
  return instance;
};
export default popup;
