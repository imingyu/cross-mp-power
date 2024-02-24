export interface CrossMpSystemInfo {
    /** 可使用窗口宽度，单位px */
    windowWidth: number;
    /** 可使用窗口高度，单位px */
    windowHeight: number;
    /** 状态栏的高度，单位px */
    statusBarHeight: number;
}

/** 小程序的环境版本 */
export type CrossMpEnvVersion = 'develop' | 'trial' | 'release' | '?';

/** 小程序环境信息 */
export interface CrossMpEnvInfo {
    /** 小程序的appId */
    appId: string;
    /** 小程序的环境版本 */
    envVersion: CrossMpEnvVersion;
    /** 小程序的版本号 */
    version: string;
}

export interface CrossMpStorageInfo {
    keys: string[];
    currentSize: number;
    limitSize: number;
}

export type AnyFunction = (...args: any[]) => any;

export interface CrossMpClientRect<T = any> {
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
    dataset: T;
}
