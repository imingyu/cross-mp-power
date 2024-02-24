import type { AnyFunction } from './types';
import { getApiVar } from './var';

export const hookApiMethodCallback = (apiName: string, onSuccess: AnyFunction, onFail: AnyFunction, args: any[]) => {
    if (!apiName.endsWith('Sync') && (!args.length || args[0] === null)) {
        args[0] = {};
    }
    if (typeof args[0] === 'object' && args[0]) {
        const { success, fail } = args[0];
        args[0].success = function HookApiSuccessCallback(...params) {
            onSuccess(...params);
            return success?.apply(this, params);
        };
        args[0].fail = function HookApiFailCallback(...params) {
            onFail(...params);
            return fail?.apply(this, params);
        };
    }
    return args;
};

export const promisifyApi = (apiName: string, ...apiArgs: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        const apiVar = getApiVar();
        if (typeof apiVar[apiName] === 'function') {
            if (apiName.indexOf('Sync') !== -1) {
                let res;
                try {
                    res = apiVar[apiName](...apiArgs);
                    const apiOptions = apiArgs[0];
                    if (apiOptions && typeof apiOptions.onResultReady === 'function') {
                        apiOptions.onResultReady(res);
                    }
                } catch (error) {
                    reject(error);
                    return;
                }

                resolve(res);
                return;
            }
            hookApiMethodCallback(
                apiName,
                (...args) => {
                    if (args.length < 2) {
                        resolve(args[0]);
                    } else {
                        resolve(args);
                    }
                },
                (...args) => {
                    const err = new Error('未知错误');
                    if (args.length < 2 && args[0] && args[0].errMsg) {
                        err.message = args[0].errMsg;
                    }
                    (err as any).failResult = args;
                    reject(err);
                },
                apiArgs
            );
            try {
                const apiOptions = apiArgs[0];
                const res = apiVar[apiName](...apiArgs);
                if (apiOptions && typeof apiOptions.onResultReady === 'function') {
                    apiOptions.onResultReady(res);
                }
            } catch (error) {
                reject(error);
            }
            return;
        }
        resolve(apiVar[apiName]);
    });
};
