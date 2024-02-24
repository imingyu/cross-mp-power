import { promisifyApi } from './call';
import type { CrossMpStorageInfo } from './types';

export const setStorage = (key: string, data: any): Promise<void> => {
    return promisifyApi('setStorage', {
        key,
        data
    }).then(() => {});
};

export const getStorage = <T>(key: string): Promise<T> => {
    return promisifyApi('getStorage', {
        key
    }).then((res) => res.data);
};

export const removeStorage = (key: string): Promise<void> => {
    return promisifyApi('removeStorage', {
        key
    }).then(() => {});
};

export const clearStorage = (): Promise<void> => {
    return promisifyApi('clearStorage').then(() => {});
};

export const getStorageInfo = (): Promise<CrossMpStorageInfo> => {
    return promisifyApi('getStorageInfo').then((res) => {
        if (BUILD_TARGET === 'my' && (!res || ('success' in res && !res.success))) {
            return Promise.reject(new Error('支付宝平台getStorageInfo返回值success=false'));
        }
        return res;
    });
};
