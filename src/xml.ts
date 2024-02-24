import type { CrossMpClientRect } from './types';
import { getApiVar } from './var';

const boundingClientRect = (mode: 'select' | 'selectAll', selector: string, ctx?: any, timeout?: number) => {
    let apiVar = getApiVar();
    if (typeof ctx === 'object' && 'createSelectorQuery' in ctx) {
        apiVar = ctx;
    }
    return new Promise((resolve, reject) => {
        let timer;
        if (timeout) {
            timer = setTimeout(() => {
                reject(new Error('timeout'));
            }, timeout);
        }
        try {
            apiVar
                .createSelectorQuery()
                // eslint-disable-next-line no-unexpected-multiline
                [mode](selector)
                .boundingClientRect((rect) => {
                    clearTimeout(timer);
                    if (mode === 'selectAll' && !rect) {
                        resolve([]);
                    } else {
                        resolve(rect);
                    }
                })
                .exec();
        } catch (error) {
            clearTimeout(timer);
            reject(error);
        }
    });
};

export const selectBoundingClientRect = <TDataSet>(
    selector: string,
    ctx?: any,
    timeout?: number
): Promise<CrossMpClientRect<TDataSet>> => {
    return boundingClientRect('select', selector, ctx, timeout) as Promise<CrossMpClientRect<TDataSet>>;
};

export const selectAllBoundingClientRect = (
    selector: string,
    ctx?: any,
    timeout?: number
): Promise<CrossMpClientRect[]> => {
    return boundingClientRect('selectAll', selector, ctx, timeout) as Promise<CrossMpClientRect[]>;
};
