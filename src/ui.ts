import { promisifyApi } from './call';
import type { AnyFunction } from './types';
import { getApiVar, getApiVarName } from './var';

export const showToast = (msg: string, duration = 2000) => {
    const config: any = {
        duration
    };
    if (typeof BUILD_TARGET === 'string' ? BUILD_TARGET === 'my' : getApiVarName() === 'my') {
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
    if (typeof BUILD_TARGET === 'string' ? BUILD_TARGET === 'my' : getApiVarName() === 'my') {
        config.items = items;
        config.title = title;
    } else {
        config.itemList = items;
        config.alertText = title;
    }
    return promisifyApi('showActionSheet', config).then((res) => {
        let index = res.tapIndex;
        if (typeof BUILD_TARGET === 'string' ? BUILD_TARGET === 'my' : getApiVarName() === 'my') {
            index = res.index;
        }
        if (typeof index !== 'number' || index < 0) {
            return Promise.reject(new Error('已取消选择'));
        }
        return index;
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
