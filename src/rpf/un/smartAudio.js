import isWeChat from './isWeChat';

const env = {
  wechat: isWeChat()
};

function smartAudio($elem, { onChange } = {}) {
  let pausedByHidden = false;

  function emitChange() {
    onChange &&
      onChange({
        paused: $elem.paused
      });
  }

  function onAuPlay() {
    emitChange();
  }

  function onAuPause() {
    emitChange();
  }

  function onDocVisChange() {
    if (document.visibilityState === 'hidden') {
      /* 程序切到后台，暂停播放，并标记 */
      if (!$elem.paused) {
        pausedByHidden = true;
        pause();
      }
    } else if (document.visibilityState === 'visible') {
      /* 程序回到前台，恢复播放 */
      if (pausedByHidden) {
        pausedByHidden = false;
        play();
      }
    }
  }

  function play() {
    function playAudio() {
      let prom = $elem.play();
      if (prom) {
        return prom.catch(err => {
          console.error('播放失败', $elem.src, err.message);
          return err;
        });
      }
      return prom;
    }

    return new Promise(resolve => {
      if (env.wechat) {
        if (window.WeixinJSBridge) {
          window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
            resolve(playAudio());
          });
        } else {
          document.addEventListener(
            'WeixinJSBridgeReady',
            () => {
              resolve(playAudio());
            },
            false
          );
        }
      } else {
        resolve(playAudio());
      }
    });
  }

  function pause() {
    return $elem.pause();
  }

  function destroy() {
    $elem.removeEventListener('play', onAuPlay);
    $elem.removeEventListener('paued', onAuPause);
    document.removeEventListener('visibilitychange', onDocVisChange);
  }

  $elem.addEventListener('play', onAuPlay);
  $elem.addEventListener('pause', onAuPause);
  document.addEventListener('visibilitychange', onDocVisChange);

  return {
    play,
    pause,
    destroy
  };
}

export default smartAudio;
