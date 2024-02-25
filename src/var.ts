import { memoize } from './_util';

// eslint-disable-next-line complexity
export const getApiVar = memoize((): any => {
    if (typeof BUILD_TARGET !== 'string') {
        if (typeof wx === 'object' && wx && typeof wx.request === 'function') {
            return wx;
        }
        if (typeof my === 'object' && my && typeof my.request === 'function') {
            return my;
        }
        if (typeof swan === 'object' && swan && typeof swan.request === 'function') {
            return swan;
        }
        if (typeof tt === 'object' && tt && typeof tt.request === 'function') {
            return tt;
        }
        if (typeof xhs === 'object' && xhs && typeof xhs.request === 'function') {
            return xhs;
        }
        if (typeof qq === 'object' && qq && typeof qq.request === 'function') {
            return qq;
        }
        if (typeof ks === 'object' && ks && typeof ks.request === 'function') {
            return ks;
        }
        return;
    }
    if (BUILD_TARGET === 'wx') {
        return wx;
    }

    if (BUILD_TARGET === 'my') {
        return my;
    }

    if (BUILD_TARGET === 'swan') {
        return swan;
    }

    if (BUILD_TARGET === 'tt') {
        return tt;
    }

    if (BUILD_TARGET === 'xhs') {
        return xhs;
    }

    if (BUILD_TARGET === 'qq') {
        return qq;
    }

    if (BUILD_TARGET === 'ks') {
        return ks;
    }
});

// eslint-disable-next-line complexity
export const getApiVarName = memoize((): string => {
    if (typeof BUILD_TARGET !== 'string') {
        if (typeof wx === 'object' && wx && typeof wx.request === 'function') {
            return 'wx';
        }
        if (typeof my === 'object' && my && typeof my.request === 'function') {
            return 'my';
        }
        if (typeof swan === 'object' && swan && typeof swan.request === 'function') {
            return 'swan';
        }
        if (typeof tt === 'object' && tt && typeof tt.request === 'function') {
            return 'tt';
        }
        if (typeof xhs === 'object' && xhs && typeof xhs.request === 'function') {
            return 'xhs';
        }
        if (typeof qq === 'object' && qq && typeof qq.request === 'function') {
            return 'qq';
        }
        if (typeof ks === 'object' && ks && typeof ks.request === 'function') {
            return 'ks';
        }
        return '?';
    }
    if (BUILD_TARGET === 'wx') {
        return 'wx';
    }

    if (BUILD_TARGET === 'my') {
        return 'my';
    }

    if (BUILD_TARGET === 'swan') {
        return 'swan';
    }

    if (BUILD_TARGET === 'tt') {
        return 'tt';
    }

    if (BUILD_TARGET === 'xhs') {
        return 'xhs';
    }

    if (BUILD_TARGET === 'qq') {
        return 'qq';
    }

    if (BUILD_TARGET === 'ks') {
        return 'ks';
    }
    return '?';
});
