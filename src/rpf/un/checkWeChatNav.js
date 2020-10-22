import isWeChat from './isWeChat';
import isIOS from './isIOS';

window._mockkWeChatNav = function (h = 554) {
  document.body.classList.add('has-wechat-nav');
  document.body.style.height = `${h}px`;
};

const INIT_WIN_HEIGHT = window.innerHeight;
const DEFAULTS = {
  maxRatio: 750 / 1206,
  bodyClass: 'has-wechat-nav',
  onTrigger: () => {}
};
let timer = null;
const MAX_QUERY = 5;

function checkWeChatNav({
  maxRatio = DEFAULTS.maxRatio,
  bodyClass = DEFAULTS.bodyClass,
  onTrigger = DEFAULTS.onTrigger
} = {}) {
  if ((!maxRatio && maxRatio !== 0) || typeof maxRatio !== 'number') {
    throw Error('maxRatio is required and should be number');
  }
  if (!bodyClass || typeof bodyClass !== 'string') {
    throw Error('bodyClass is required and should be string');
  }
  if (!onTrigger || typeof onTrigger !== 'function') {
    throw Error('onTrigger is required and should be function');
  }

  function emitTrigger(nowWinHeight) {
    const nowWinWidth = window.innerWidth;

    const nowRatio = nowWinWidth / nowWinHeight;
    if (
      isWeChat() &&
      isIOS() &&
      nowWinHeight < INIT_WIN_HEIGHT &&
      nowRatio > maxRatio
    ) {
      if (!document.body.classList.contains(bodyClass)) {
        document.body.classList.add(bodyClass);
      }
      document.body.style.height = `${nowWinHeight}px`;
      onTrigger();
    }
  }

  clearInterval(timer);
  let cnt = 0;
  timer = setInterval(() => {
    const nowWinHeight = window.innerHeight;
    if (nowWinHeight < INIT_WIN_HEIGHT) {
      emitTrigger(nowWinHeight);
      clearInterval(timer);
    }
    cnt++;
    if (cnt >= MAX_QUERY) {
      clearInterval(timer);
    }
  }, 500);
}

export default checkWeChatNav;
