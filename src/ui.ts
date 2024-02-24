import { promisifyApi } from './call';
import type { AnyFunction } from './types';
import { getApiVar } from './var';

export const showToast = (msg: string, duration = 2000) => {
    const config: any = {
        duration
    };
    if (BUILD_TARGET === 'my') {
        config.content = msg;
        config.type = 'none';
    } else {
        config.icon = 'none';
        config.title = msg;
    }
    getApiVar().showToast(config);
};

export const showActionSheet = (items: string[], title?: string): Promise<number> => {
    const config: any = {};
    if (
        BUILD_TARGET === 'wx' ||
        BUILD_TARGET === 'swan' ||
        BUILD_TARGET === 'tt' ||
        BUILD_TARGET === 'ks' ||
        BUILD_TARGET === 'qq' ||
        BUILD_TARGET === 'xhs'
    ) {
        config.itemList = items;
        config.alertText = title;
    }
    if (BUILD_TARGET === 'my') {
        config.items = items;
        config.title = title;
    }
    return promisifyApi('showActionSheet', config).then((res) => {
        if (
            BUILD_TARGET === 'wx' ||
            BUILD_TARGET === 'swan' ||
            BUILD_TARGET === 'tt' ||
            BUILD_TARGET === 'ks' ||
            BUILD_TARGET === 'qq' ||
            BUILD_TARGET === 'xhs'
        ) {
            return res.tapIndex;
        }
        if (BUILD_TARGET === 'my') {
            if (res.index === -1) {
                return Promise.reject(new Error('已取消选择'));
            }
            return res.index;
        }
    });
};

export const nextTick = (cb: AnyFunction, delay = 120) => {
    const apiVar = getApiVar();
    if ('nextTick' in apiVar) {
        apiVar.nextTick(cb);
        return;
    }
    setTimeout(cb, delay);
};
