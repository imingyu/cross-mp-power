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
export const checkDebugEnabled = (() => {
    let res: boolean | undefined;
    return (): boolean => {
        if (res !== undefined) {
            return res;
        }
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
    };
})();

const getEnvInfo = (() => {
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
    // eslint-disable-next-line complexity
    return (): CrossMpEnvInfo => {
        if (res !== undefined) {
            return res;
        }
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
                res = my.getAccountInfoSync()?.miniProgram?.envVersion;
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
        return d();
    };
})();

/** 获取小程序环境版本，可选值及含义：
 * develop=开发/预览环境版本;
 * trial=体验环境版本;
 * release=发布环境版本;
 * ?=未知环境版本;
 */
export const getCurrentEnvVersion = (() => {
    let res: CrossMpEnvVersion | undefined;
    return (): CrossMpEnvVersion => {
        if (res !== undefined) {
            return res;
        }
        return (res = getEnvInfo().envVersion);
    };
})();

export const getCurrentAppId = (() => {
    let res: string | undefined;
    return (): string => {
        if (res !== undefined) {
            return res;
        }
        return (res = getEnvInfo().appId);
    };
})();

export const getCurrentAppVersion = (() => {
    let res: string | undefined;
    return (): string => {
        if (res !== undefined) {
            return res;
        }
        return (res = getEnvInfo().version);
    };
})();