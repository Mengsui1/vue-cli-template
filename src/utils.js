function handleApi(promise) {
  return promise
    .then(res => {
      return [null, res];
    })
    .catch(err => {
      // 弹出错误弹窗
      //   openErrorModal(err);
      // 上报错误
      if (err.type === 'api') {
        window.Sentry.withScope(function(scope) {
          const { url, baseURL, method } = err.config;
          const path = url.replace(baseURL, '');
          // 根据请求方法和路径进行分组
          scope.setFingerprint([method, path]);
          window.Sentry.captureException(err);
        });
      } else {
        window.Sentry.captureException(err);
      }
      return [err, null];
    });
}
export { handleApi };
