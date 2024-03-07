import type { CrossMpClientRect, SelectBoundingClientRectConfig } from './types';
import { getApiVar, getApiVarName } from './var';

const boundingClientRect = (mode: 'select' | 'selectAll', config: SelectBoundingClientRectConfig) => {
    let { ctx, timeout, retryCount = 0, retryDelay = 100, selector, createSelectorQueryConfig } = config;
    let apiVar = getApiVar();
    if (typeof ctx === 'object' && 'createSelectorQuery' in ctx) {
        apiVar = ctx;
    }
    if (
        typeof BUILD_TARGET === 'string'
            ? BUILD_TARGET === 'swan'
            : getApiVarName() === 'swan' && selector.split('.').length > 2
    ) {
        console.warn(
            '百度小程序平台下使用多个class选择器获取boundingClientRect时可能拿不到数据，建议换成单个class或者id选择器'
        );
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
                    .createSelectorQuery(createSelectorQueryConfig)
                    // eslint-disable-next-line no-unexpected-multiline
                    [mode](selector)
                    .boundingClientRect()
                    .exec((rect) => {
                        rect = rect?.[0];
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
                    });
            } catch (error) {
                clearTimeout(timer);
                reject(error);
            }
        };
        fire();
    });
};

export const selectBoundingClientRect = <TDataSet>(
    config: SelectBoundingClientRectConfig
): Promise<CrossMpClientRect<TDataSet>> => {
    return boundingClientRect('select', config) as Promise<CrossMpClientRect<TDataSet>>;
};

export const selectAllBoundingClientRect = (config: SelectBoundingClientRectConfig): Promise<CrossMpClientRect[]> => {
    return boundingClientRect('selectAll', config) as Promise<CrossMpClientRect[]>;
};
