/**
 *
 *
 * @export
 * @param {object} AxiosRequestConfig https://github.com/axios/axios/blob/master/index.d.ts#L44
 */
export default function mockPage(AxiosRequestConfig) {
  window.location.href =
    'https://mock-page.h5.h5no1.com/mock-page/?config=' +
    encodeURIComponent(JSON.stringify(AxiosRequestConfig));
}
