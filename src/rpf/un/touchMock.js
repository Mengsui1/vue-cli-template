let elemMap = {};
let prevKey = null;
let prevType = null;
let id = 0;

const $wrap = document.createElement('div');
$wrap.style.zIndex = 999;
$wrap.setAttribute('data-touch-mock', 'true');
document.body.appendChild($wrap);

function createMockElem(key) {
  const $elem = document.createElement('div');
  $elem.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    background-color: rgba(255, 0, 0, 0.5);
    border-radius: 50%;
    transform: translate3d(0, 0, 0);
    pointer-events: none;
    z-index: 999;
    visibility: hidden;
  `;
  $elem.setAttribute('data-key', key);
  // $elem.textContent = key;
  $wrap.appendChild($elem);
  return $elem;
}

let hideTimer = null;
function clearElem() {
  prevType = null;
  Object.keys(elemMap).forEach(k => {
    elemMap[k].$mockElems.forEach(el => (el.style.visibility = 'hidden'));
  });
}

function touchMock(fn, mockTouches = []) {
  const key = 'k' + id;
  const $mockElems = mockTouches.map(() => {
    return createMockElem(key);
  });
  elemMap[key] = {
    $mockElems,
    mockTouches
  };
  id++;

  return e => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(clearElem, 1000);
    if (prevType !== e.type + key) {
      if (prevKey) {
        const { $mockElems } = elemMap[prevKey];
        $mockElems.forEach(el => {
          el.style.visibility = 'hidden';
        });
      }
      prevKey = key;
      const { $mockElems, mockTouches } = elemMap[prevKey];
      $mockElems.forEach((el, i) => {
        const t = mockTouches[i];
        el.style.visibility = 'visible';
        el.style.transform = `translate3d(${t.clientX - 10}px, ${
          t.clientY - 10
        }px, 0)`;
      });
      prevType = e.type + key;
    }
    fn(e, mockTouches);
  };
}

export default touchMock;
