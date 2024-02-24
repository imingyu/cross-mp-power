export const getApiVar = (): any => {
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
};

export const getApiVarName = (): string => {
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
};
