import { memoize } from './_util';
import type { CrossMpEnvInfo, CrossMpEnvVersion, CrossMpSystemInfo } from './types';
import { getApiVar } from './var';

export const getSystemInfo = (() => {
    let cache: CrossMpSystemInfo | undefined;
    return (ignoreCache?: boolean): Readonly<CrossMpSystemInfo> => {
        if (!cache || ignoreCache) {
            cache = getApiVar().getSystemInfoSync();
        }
        return cache as Readonly<CrossMpSystemInfo>;
    };
})();

/** 检查当前是否开启了调试 */
export const checkDebugEnabled = memoize((): boolean => {
    let res;
    if (BUILD_TARGET === 'wx') {
        if ('getAppBaseInfo' in wx) {
            res = wx.getAppBaseInfo()?.enableDebug;
        }
        if (typeof res !== 'boolean') {
            res = (getSystemInfo() as any).enableDebug;
        }
        if (typeof res !== 'boolean' && typeof __wxConfig === 'object') {
            res = !!__wxConfig.debug;
        }
        return (res = res || false);
    }
    if (BUILD_TARGET === 'qq') {
        return (res =
            (typeof __wxConfig === 'object' && !!__wxConfig.debug) ||
            (typeof __qqConfig === 'object' && !!__qqConfig.debug));
    }
    return (res = false);
});

// eslint-disable-next-line complexity
const getEnvInfo = memoize((): CrossMpEnvInfo => {
    let res: CrossMpEnvInfo | undefined;
    const d = (val?: CrossMpEnvInfo): CrossMpEnvInfo => {
        if (val) {
            return (res = {
                appId: val.appId || '?',
                envVersion: val.envVersion || '?',
                version: val.version || '?'
            });
        }
        return (res = {
            appId: '?',
            envVersion: '?',
            version: '?'
        });
    };
    if (BUILD_TARGET === 'wx') {
        if ('getAccountInfoSync' in wx) {
            res = wx.getAccountInfoSync()?.miniProgram;
        }
        if (!res && typeof __wxConfig === 'object') {
            return d({
                envVersion: __wxConfig.envVersion,
                appId: __wxConfig.accountInfo?.appId || '?',
                version: '?'
            });
        }
        return d(res);
    }

    if (BUILD_TARGET === 'qq') {
        if ('getAccountInfoSync' in qq) {
            res = qq.getAccountInfoSync()?.miniProgram;
        }
        if (!res && typeof __wxConfig === 'object') {
            let cfg;
            if (
                (typeof __wxConfig === 'object' ? (cfg = __wxConfig) : false) ||
                (typeof __qqConfig === 'object' ? (cfg = __qqConfig) : false)
            ) {
                return d({
                    envVersion: cfg.envVersion,
                    appId: cfg.accountInfo?.appId || '?',
                    version: '?'
                });
            }
        }
        return d(res);
    }

    if (BUILD_TARGET === 'my') {
        if ('getAccountInfoSync' in my) {
            res = my.getAccountInfoSync()?.miniProgram;
        }
        if (!res && typeof __appxStartupParams === 'object') {
            return d({
                envVersion: __appxStartupParams.envVersion || (my.isIDE ? 'develop' : '?'),
                appId: __appxStartupParams.appId || '?',
                version: '?'
            });
        }
        return d(res);
    }

    const apiVar = getApiVar();
    if ('getAccountInfoSync' in apiVar) {
        res = apiVar.getAccountInfoSync()?.miniProgram;
    }
    return d(res);
});

/** 获取小程序环境版本，可选值及含义：
 * develop=开发/预览环境版本;
 * trial=体验环境版本;
 * release=发布环境版本;
 * ?=未知环境版本;
 */
export const getCurrentEnvVersion = memoize((): CrossMpEnvVersion => {
    return getEnvInfo().envVersion;
});

export const getCurrentAppId = memoize((): string => {
    return getEnvInfo().appId;
});

export const getCurrentAppVersion = memoize(() => {
    return getEnvInfo().version;
});
