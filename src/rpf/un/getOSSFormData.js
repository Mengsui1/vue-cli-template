function getOSSFormData(tokenRes, file) {
  const fd = new FormData();
  const { accessid, policy, signature, key } = tokenRes;
  fd.append('OSSAccessKeyId', accessid);
  fd.append('policy', policy);
  fd.append('Signature', signature);
  fd.append('key', key);
  fd.append('file', file);
  return fd;
}

export default getOSSFormData;
