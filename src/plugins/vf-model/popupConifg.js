import getExportData from '@/plugins/getExportData.js';
const config = getExportData(
  'vue',
  require.context('@/components/popup', true, /\w+\.(vue)$/),
  false
);
// const commonConfig = getExportData(
//   'vue',
//   require.context('@/tpl/commonPopup', true, /\w+\.(vue)$/),
//   false
// );

export default { ...config };
