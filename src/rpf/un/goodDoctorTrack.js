function makeLog(params = {}, callback) {
  if (window.report && window.report.logger) {
    params = {
      url: window.location.href,
      refer: document.referrer,
      ...params
    };

    try {
      window.report.logger.makelog(params);
      if (typeof callback === 'function') {
        setTimeout(() => {
          callback(true);
        }, 100);
      }
      console.info(
        '好医生打点成功: \n' +
          JSON.stringify(params)
            .replace(/,/g, ',\n')
            .replace(/^(.)/, '$1\n')
            .replace(/(.)$/, '\n$1')
      );
    } catch (e) {
      if (typeof callback === 'function') {
        callback();
      }
      console.error('好医生打点出错: ' + e.message);
    }
    if (makeLog.start) {
      delete makeLog.start;
    }

    // 打点 js 没加载完
    // 等 50ms 再执行
    // 如果打点 js 3s没加载完将不执行打点
  } else {
    if (!makeLog.start) {
      makeLog.start = new Date();
    }
    if (new Date() - makeLog.start > 3000) {
      if (typeof callback === 'function') {
        callback();
      }
      console.error('好医生打点 js 3s没加载完');

      return;
    }
    setTimeout(() => {
      makeLog(params, callback);
    }, 50);
  }
}

/**
 *
 *
 * @export
 * @param {*} projectName
 */
export function goodDoctorInit(projectName) {
  if (window.beacon && window.beacon.PROJECT)
    console.error('goodDoctorInit只能初始化一次');
  window.beacon = window.beacon || {};
  window.beacon.PROJECT = projectName;
}

/**
 *
 *
 * @export
 * @param {*} {
 *   Beacon__evt,
 *   Beacon__page_id,
 *   Beacon__event_desc,
 *   Beacon__channel,
 *   callback
 * }
 */
export default async function goodDoctorTrack({
  Beacon__evt,
  Beacon__page_id,
  Beacon__event_desc,
  Beacon__channel,
  callback
}) {
  if (!window.beacon || !window.beacon.PROJECT)
    return console.error('请先调用goodDoctorInit方法初始化项目');

  if (Beacon__evt === null || Beacon__evt === undefined)
    return console.error('好医生埋点报错：缺少参数 Beacon__evt');
  if (Beacon__page_id === null || Beacon__page_id === undefined)
    return console.error('好医生埋点报错：缺少参数 Beacon__page_id');
  if (Beacon__event_desc === null || Beacon__event_desc === undefined)
    return console.error('好医生埋点报错：缺少参数 Beacon__event_desc');
  if (Beacon__channel === null || Beacon__channel === undefined)
    return console.error('好医生埋点报错：缺少参数 Beacon__channel');

  makeLog(
    {
      evt: Beacon__evt,
      page_id: Beacon__page_id,
      event_desc: JSON.stringify({
        from: Beacon__event_desc
      }),
      channel: Beacon__channel
    },
    callback
  );
}
