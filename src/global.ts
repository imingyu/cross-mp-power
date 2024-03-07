import { memoize } from './_util';
import { getApiVar } from './var';

export const getGlobalObject = memoize(function (this: any) {
    if (typeof global === 'object' && global) {
        return global;
    }
    if (typeof globalThis === 'object' && globalThis) {
        return globalThis;
    }
    if (typeof this === 'object' && this) {
        return this;
    }
    const key = '__crmpGlobal__';
    let apiVar;
    if ((apiVar = getApiVar())) {
        apiVar[key] = apiVar[key] || {};
        return apiVar[key];
    }
    if (typeof getApp === 'function') {
        let app;
        if (BUILD_TARGET === 'wx' || BUILD_TARGET === 'qq') {
            app = getApp({ allowDefault: true });
        } else {
            app = getApp();
        }
        app[key] = app[key] || {};
        return app[key];
    }
    return {};
});
