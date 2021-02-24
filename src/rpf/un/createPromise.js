function createPromise() {
  let resFn = null;
  let rejFn = null;
  const prom = new Promise((resolve, reject) => {
    resFn = resolve;
    rejFn = reject;
  });
  return {
    done: prom,
    resolve: resFn,
    reject: rejFn
  };
}

export default createPromise;
