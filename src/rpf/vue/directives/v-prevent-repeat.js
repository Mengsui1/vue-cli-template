export default {
  install(Vue) {
    const aFunMap = new Map();
    const bind = (el, { arg, value, modifiers }, vnode) => {
      let flag = false;
      const [RUNNING_CLASS = '__v_prevent_repeat__disabled'] = Object.keys(
        modifiers
      );
      let aFun = async ev => {
        if (flag) return;
        flag = true;
        el.classList.add(RUNNING_CLASS);
        await value.bind(vnode)(ev);
        flag = false;
        el.classList.remove(RUNNING_CLASS);
      };
      aFunMap.set(el, aFun);
      el.addEventListener(arg, aFun);
    };
    Vue.directive('prevent-repeat', {
      bind,
      update(el, { arg, value, modifiers }, vnode) {
        el.removeEventListener(arg, aFunMap.get(el));
        bind(el, { arg, value, modifiers }, vnode);
      },
      unbind(el, { arg }) {
        el.removeEventListener(arg, aFunMap.get(el));
        aFunMap.delete(el);
      }
    });
  }
};
