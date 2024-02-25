import { memoize } from './_util';
import { getApiVarName } from './var';

export const supportSelectOwnerComponent = memoize((): boolean => {
    if (typeof BUILD_TARGET === 'string') {
        return BUILD_TARGET === 'wx' || BUILD_TARGET === 'my';
    }
    const name = getApiVarName();
    return name === 'wx' || name === 'my';
});
