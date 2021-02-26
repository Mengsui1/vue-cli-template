/**
 * 获取指定路径下文件的export数据
 *
 * @param {string} matchFileSuffix 匹配文件的后缀名 [js|vue]
 * @param {function} requireList require.context()返回的数据
 * https://webpack.js.org/guides/dependency-management/#context-module-api
 * @param {boolean} nest 是否根据路径嵌套数据
 * @return {Object}
 * Usage:
  
  import  getExportData from '@/utils/getExportData.js';
  const config = getExportData('js',require.context(
    '@/path',
    true,
    /\w+\.(vue)$/
  ))
  // config = {
    文件名：输出的模块
  }

 *  */

function getExportData(fileSuffix, requireList, nest = true) {
  let dataObj = {};

  requireList.keys().forEach(fileName => {
    if (new RegExp('^index.(js)$').test(fileName)) return; //排除index.js文件；
    const config = requireList(fileName); //获取文件输出内容
    let fileNameArray = fileName
      .replace(new RegExp('(^./)|(.' + fileSuffix + ')', 'g'), '') //去除./和文件后缀名
      .split('/'); //通过 / 拆分路径

    //遍历路径数组，创建对应的嵌套对象，并把文件输出内容存储到最里层的key上
    if (nest) {
      fileNameArray.reduce((accumulator, currentValue) => {
        if (!accumulator[currentValue]) {
          accumulator[currentValue] =
            fileNameArray[fileNameArray.length - 1] === currentValue
              ? config.default || config
              : {};
        }
        return accumulator[currentValue];
      }, dataObj);
    } else {
      const key = [fileNameArray[fileNameArray.length - 1]];
      if (dataObj[key]) throw new Error('命名重复：' + key);
      dataObj[key] = config.default || config;
    }
  });
  return dataObj;
}
export default getExportData;

// usage
// import  getExportData from '@/utils/getExportData.js';
// getExportData('js',require.context(
//   '@/utils/',
//   true,
//   /\w+\.(js)$/
// ))
