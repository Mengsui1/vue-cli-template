declare class BatchRequester<T extends (...args: any[]) => Promise<any>> {
    private batchSize;
    private requestingCount;
    private queue;
    private requester;
    constructor(requester: T, batchSize?: number);
    request(...args: Parameters<T>): ReturnType<T>;
    stop(): void;
    private requestWhenIdle;
}
export default BatchRequester;
