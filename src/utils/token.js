import config from '@/config/index.js';
export function setToken(value) {
  localStorage.setItem(`${config.tokenKey}`, value);
}
export function getToken() {
  return localStorage.getItem(`${config.tokenKey}`);
}
