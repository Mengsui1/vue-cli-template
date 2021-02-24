const qs = {
  stringify: function (query) {
    return Object.keys(query)
      .map(function (k) {
        return k + '=' + encodeURIComponent(query[k]);
      })
      .join('&');
  }
};

const webMinaShare = {
  setShare: function ({ title, imageUrl, pathname, search, hash }) {
    window.wx.miniProgram.postMessage({
      data: {
        type: 'onShareAppMessage',
        title,
        imageUrl,
        pathname,
        search,
        hash
      }
    });
  },
  openNativeShare: function ({ title, imageUrl, pathname, search, hash }) {
    window.wx.miniProgram.navigateTo({
      url:
        '/pages/share/share?' +
        qs.stringify({ title, imageUrl, pathname, search, hash })
    });
  },
  openNative: function (nativePath, options) {
    window.wx.miniProgram.navigateTo({
      url: `${nativePath}?` + qs.stringify(options)
    });
  }
};

export default webMinaShare;
