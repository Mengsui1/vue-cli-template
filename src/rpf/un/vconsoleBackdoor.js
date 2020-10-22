const winW = window.innerWidth;
let winH = window.innerHeight;

const MAX_QUERY = 5;
let timer = null;
let cnt = 0;

function vconsoleBackdoor() {
  clearInterval(timer);
  timer = setInterval(() => {
    const nowWinHeight = window.innerHeight;
    if (nowWinHeight < winH) {
      winH = nowWinHeight;
      clearInterval(timer);
    }
    cnt++;
    if (cnt >= MAX_QUERY) {
      clearInterval(timer);
    }
  }, 500);

  const $style = document.createElement('style');
  $style.type = 'text/css';
  $style.textContent = '#__vconsole { display: none; }';
  document.getElementsByTagName('head')[0].appendChild($style);

  let touchCnt = 0;
  let touchTimer = null;
  document.addEventListener('touchstart', function (e) {
    clearTimeout(touchTimer);
    touchTimer = setTimeout(function () {
      touchCnt = 0;
    }, 350);
    const touch = e.touches[0];
    const { clientX, clientY } = touch;
    if (
      e.touches.length === 1 &&
      clientX >= winW - 50 &&
      clientY >= winH - 50
    ) {
      touchCnt++;
    }
    if (touchCnt === 10) {
      touchCnt = 0;
      document.getElementById('__vconsole').style.display = 'block';
    }
  });
}

export default vconsoleBackdoor;
