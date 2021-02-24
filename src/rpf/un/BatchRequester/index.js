class BatchRequester {
  constructor(requester, batchSize = 10) {
    this.requestingCount = 0;
    this.queue = [];
    this.batchSize = batchSize;
    this.requester = requester;
  }
  request(...args) {
    const { requestingCount, batchSize } = this;
    if (requestingCount < batchSize) {
      this.requestingCount += 1;
      return this.requester(...args).finally(() => {
        this.requestingCount -= 1;
        this.queue.shift()?.();
      });
    } else {
      return this.requestWhenIdle(...args);
    }
  }
  stop() {
    this.queue = [];
  }
  requestWhenIdle(...args) {
    return new Promise((resolve, reject) => {
      const cb = async () => {
        try {
          const res = await this.request(...args);
          resolve(res);
        } catch (e) {
          reject(e);
        }
      };
      this.queue.push(cb);
    });
  }
}
export default BatchRequester;
