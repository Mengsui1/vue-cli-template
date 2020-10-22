let prefix = '';

function validateInvoke(prefix, name) {
  if (!prefix) {
    throw Error('set prefix before calling .' + name);
  }
}

const privateStorage = {
  setPrefix(val) {
    if (typeof val !== 'string') {
      throw Error('prefix should be string');
    }
    prefix = val;
  },
  getItem(key) {
    validateInvoke(prefix, 'getItem');
    return localStorage.getItem(prefix + key);
  },
  setItem(key, value) {
    validateInvoke(prefix, 'setItem');
    return localStorage.setItem(prefix + key, value);
  },
  removeItem(key) {
    validateInvoke(prefix, 'removeItem');
    return localStorage.removeItem(prefix + key);
  }
};

export default privateStorage;
