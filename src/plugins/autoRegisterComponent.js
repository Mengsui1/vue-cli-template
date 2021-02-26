import Vue from 'vue';
import getExportData from '@/plugins/getExportData.js';
const componentsConfig = getExportData(
  'vue',
  require.context('@/components/PopupWrapper', false, /\w+\.(vue)$/),
  false
);
const config = Object.assign({}, componentsConfig);
Object.keys(config).forEach(key => {
  Vue.component(key, config[key]);
});

export { componentsConfig };
