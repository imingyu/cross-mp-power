import type { CrossMpClientRect } from './types';
import { getApiVar } from './var';

const boundingClientRect = (
    mode: 'select' | 'selectAll',
    selector: string,
    ctx?: any,
    timeout?: number,
    retryCount?: number,
    retryDelay?: number
    // eslint-disable-next-line max-params
) => {
    let apiVar = getApiVar();
    if (typeof ctx === 'object' && 'createSelectorQuery' in ctx) {
        apiVar = ctx;
    }
    return new Promise((resolve, reject) => {
        let timer;
        if (timeout) {
            timer = setTimeout(() => {
                reject(new Error(`boundingClientRect {${selector}} timeout`));
            }, timeout);
        }
        const fire = () => {
            try {
                apiVar
                    .createSelectorQuery()
                    // eslint-disable-next-line no-unexpected-multiline
                    [mode](selector)
                    .boundingClientRect((rect) => {
                        if (rect) {
                            clearTimeout(timer);
                            resolve(rect);
                            return;
                        }
                        if (!retryCount) {
                            clearTimeout(timer);
                            reject(new Error(`boundingClientRect {${selector}} not result`));
                            return;
                        }
                        retryCount--;
                        if (retryCount < 0) {
                            clearTimeout(timer);
                            reject(new Error('not result'));
                            return;
                        }
                        setTimeout(fire, retryDelay || 0);
                    })
                    .exec();
            } catch (error) {
                clearTimeout(timer);
                reject(error);
            }
        };
        fire();
    });
};

export const selectBoundingClientRect = <TDataSet>(
    selector: string,
    ctx?: any,
    timeout?: number,
    retryCount = 0,
    retryDelay = 100
): Promise<CrossMpClientRect<TDataSet>> => {
    return boundingClientRect('select', selector, ctx, timeout, retryCount, retryDelay) as Promise<
        CrossMpClientRect<TDataSet>
    >;
};

export const selectAllBoundingClientRect = (
    selector: string,
    ctx?: any,
    timeout?: number,
    retryCount = 0,
    retryDelay = 100
): Promise<CrossMpClientRect[]> => {
    return boundingClientRect('selectAll', selector, ctx, timeout, retryCount, retryDelay) as Promise<
        CrossMpClientRect[]
    >;
};
