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
        const app = getApp({ allowDefault: true });
        app[key] = app[key] || {};
        return app[key];
    }
    return {};
});
