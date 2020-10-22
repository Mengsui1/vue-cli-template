function disablePageCache() {
  function onPageShow(e) {
    if (/(iPhone|iPad); /i.test(navigator.userAgent) && e.persisted) {
      window.location.reload();
    }
  }
  window.addEventListener('pageshow', onPageShow);
  return {
    cancel() {
      window.removeEventListener('pageshow', onPageShow);
    }
  };
}

export default disablePageCache;
