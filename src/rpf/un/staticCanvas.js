import isCrossOrigin from './isCrossOrigin';

async function staticCanvas({ width, height, layers = [] } = {}) {
  if (typeof width !== 'number') {
    throw new Error('width is required and should be a number');
  }
  if (typeof height !== 'number') {
    throw new Error('height is required and should be a number');
  }
  if (!Array.isArray(layers)) {
    throw new Error('layers is required and should be an array');
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;

  for (let layerItem of layers) {
    let { type, ...attrs } = layerItem;
    if (type === 'image') {
      let newSrc = null;
      if (typeof layerItem.src === 'function') {
        newSrc = await layerItem.src();
      } else {
        newSrc = layerItem.src;
      }
      attrs.src = newSrc;
      // 画图
      if (attrs.borderRadius) {
        await mask(ctx, attrs);
      } else {
        await paint(ctx, attrs);
      }
    } else if (type === 'text') {
      await text(ctx, attrs);
    } else if (type === 'rect') {
      await rect(ctx, attrs);
    } else if (type === 'circle') {
      await circle(ctx, attrs);
    } else if (type === 'html') {
      await html(ctx, attrs);
    }
  }
  return canvas;
}

// 图片
async function paint(ctx, attrs) {
  const dd = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    src: '',
    ...attrs
  };
  const img = await loadImageFrom(dd.src);
  ctx.save();
  ctx.drawImage(
    img,
    dd.x,
    dd.y,
    dd.width || img.width,
    dd.height || img.height
  );
  ctx.restore();
}

function setCtx(ctx, props) {
  const propsMap = {
    fill: 'fillStyle',
    stroke: 'strokeStyle',
    strokeWidth: 'lineWidth',
    opacity: 'globalAlpha'
  };
  Object.keys(props).forEach(k => {
    if (propsMap[k]) {
      ctx[propsMap[k]] = props[k];
    } else {
      ctx[k] = props[k];
    }
  });
  return ctx;
}

// 文字
function text(ctx, attrs) {
  const ctxProps = {
    font: '16px Arial',
    text: '[text]',
    fill: '#000',
    stroke: '#000',
    strokeWidth: 0,
    textBaseline: 'top',
    textAlign: 'start',
    maxWidth: 0,
    lineHeight: 0,
    x: 0,
    y: 0,
    ...attrs
  };
  resetX();
  ctx.save();
  const {
    x,
    y,
    text,
    maxWidth,
    lineHeight,
    textOverflow,
    ...restProps
  } = ctxProps;
  setCtx(ctx, restProps);
  getTextList().forEach((text, index) => {
    fillText(text, y + lineHeight * index);
  });
  ctx.restore();

  function resetX() {
    if (!ctxProps.maxWidth) return;
    if (ctxProps.textAlign === 'center') ctxProps.x += ctxProps.maxWidth / 2;
    if (ctxProps.textAlign === 'end') ctxProps.x += ctxProps.maxWidth;
  }
  function getTextList() {
    const texts = text.split('\n');
    let textList = [];
    texts.map(text => {
      if (!isOverflow(text)) return textList.push(text);
      if (typeof textOverflow === 'string') {
        return textList.push(handleOverflowText(text));
      }
      return textList.push(...splitOverflowText(text));
    });
    return textList;
  }
  function handleOverflowText(texts) {
    let res = '';
    for (let i = 0; i < texts.length; i++) {
      if (isOverflow(res + texts[i] + textOverflow)) return res + textOverflow;
      res += texts[i];
    }
  }
  function splitOverflowText(text) {
    let res = [];
    const last = Array.from(text).reduce((acc, curr) => {
      if (!isOverflow(acc + curr)) return acc + curr;
      res.push(acc);
      return curr;
    });
    return [...res, last];
  }
  function isOverflow(text) {
    return maxWidth && ctx.measureText(text).width > maxWidth;
  }
  function fillText(text, y) {
    if (restProps.stroke && restProps.strokeWidth) {
      ctx.strokeText(text, x, y);
    }
    ctx.fillText(text, x, y);
  }
}

// 矩形
function rect(ctx, attrs) {
  const ctxProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fill: '#fff',
    stroke: '#000',
    strokeWidth: 1,
    opacity: 1,
    ...attrs
  };
  ctx.save();
  ctx.beginPath();
  const { x, y, width, height, ...restProps } = ctxProps;
  setCtx(ctx, restProps);
  ctx.rect(x, y, width, height);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// 圆
function circle(ctx, attrs) {
  const ctxProps = {
    x: 0,
    y: 0,
    radius: 0,
    fill: '#fff',
    stroke: '#000',
    strokeWidth: 1,
    opacity: 1,
    ...attrs
  };
  ctx.save();
  ctx.beginPath();
  const { x, y, radius, ...restProps } = ctxProps;
  setCtx(ctx, restProps);
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

// 圆角图片
async function mask(ctx, attrs) {
  let dd = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    src: '',
    borderRadius: 0,
    ...attrs
  };
  const img = await loadImageFrom(dd.src);
  if (!dd.width) {
    dd.width = img.width;
  }
  if (!dd.height) {
    dd.height = img.height;
  }
  // 直径最大取高度一半
  let arcRadius = dd.borderRadius;
  if (arcRadius > dd.height) {
    arcRadius = parseInt(dd.height) / 2;
  }

  ctx.save();
  // 从左上角相切的顶边切点开始，画一直线至右上角相切的顶边切点，然后绘制一条270°顺时针至0°的短圆弧
  ctx.moveTo(dd.x + arcRadius, dd.y);
  ctx.lineTo(dd.x + dd.width - arcRadius, dd.y);
  ctx.arc(
    dd.x + dd.width - arcRadius,
    dd.y + arcRadius,
    arcRadius,
    (Math.PI / 180) * 270,
    0,
    false
  );
  ctx.lineTo(dd.x + dd.width, dd.y + dd.height - arcRadius);
  // 0°顺时针至90°的短圆弧
  ctx.arc(
    dd.x + dd.width - arcRadius,
    dd.y + dd.height - arcRadius,
    arcRadius,
    0,
    (Math.PI / 180) * 90,
    0,
    false
  );
  ctx.lineTo(dd.x + arcRadius, dd.y + dd.height);
  // 90°顺时针至180°的短圆弧
  ctx.arc(
    dd.x + arcRadius,
    dd.y + dd.height - arcRadius,
    arcRadius,
    (Math.PI / 180) * 90,
    (Math.PI / 180) * 180,
    false
  );
  ctx.lineTo(dd.x, dd.y + arcRadius);
  // 180°顺时针至270°的短圆弧
  ctx.arc(
    dd.x + arcRadius,
    dd.y + arcRadius,
    arcRadius,
    (Math.PI / 180) * 180,
    (Math.PI / 180) * 270,
    false
  );
  ctx.clip();

  ctx.drawImage(img, dd.x, dd.y, dd.width, dd.height);
  ctx.restore();
}

// 以svg形式渲染html元素
function html(ctx, { x = 0, y = 0, ...attrs } = {}) {
  const { html, css } = attrs;
  const PRELOED_COUT_ID = '__PRELOED_COUT_ID';
  let preLoadCout = document.getElementById(PRELOED_COUT_ID);
  if (!preLoadCout) {
    preLoadCout = document.createElement('div');
    preLoadCout.id = PRELOED_COUT_ID;
    preLoadCout.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      width: 100%;
      pointer-events: none;
    `;
    document.body.appendChild(preLoadCout);
  }
  const node = document.createElement('div');
  node.innerHTML = html;
  for (let [key, value] of Object.entries(css)) {
    node.style[key] = value;
  }
  node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  preLoadCout.appendChild(node);
  const { width, height } = node.getBoundingClientRect();
  preLoadCout.removeChild(node);
  const xhtml = escapeXhtml(new XMLSerializer().serializeToString(node));
  const foreignDomStr = `<foreignObject x="0" y="0" width="100%" height="100%">${xhtml}</foreignObject>`;
  const svgDomStr = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${foreignDomStr}</svg>`;
  return paint(ctx, {
    src: svgDomStr,
    width,
    height,
    x,
    y
  });
}

// tools
function loadImageFrom(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    //判断是否跨域
    if (isCrossOrigin(src)) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(Error(`fail to load image from ${src}`));
    };
    img.src = src;
  });
}

function escapeXhtml(string) {
  return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
}

export default staticCanvas;
