import filterQuery from './filterQuery';

function minCdnImg(src, width = 0, quality = 75) {
  if (!/cdn2\.h5no1\.com/.test(src)) {
    console.warn(`${src} 不是来自 cdn 的图片`);
  }
  return filterQuery(src, [], {
    'x-oss-process': [
      'image',
      width ? `resize,w_${width}` : undefined,
      `quality,q_${quality}`
    ]
      .filter(i => i)
      .join('/')
  });
}

export default minCdnImg;
