import { showToast } from './ui';
import { getApiVar } from './var';

export const setClipboardData = (data: string, showFailToast = true): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        getApiVar()[BUILD_TARGET === 'my' ? 'setClipboard' : 'setClipboardData']({
            [BUILD_TARGET === 'my' ? 'text' : 'data']: data,
            success: () => {
                resolve();
            },
            fail: (res) => {
                const msg =
                    res?.errMsg?.indexOf('permission') !== -1
                        ? '未配置隐私保护指引，无法复制，请参考小程序官方文档'
                        : `复制失败：${res?.errMsg || '未知错误'}`;
                if (!showFailToast) {
                    return reject(new Error(msg));
                }
                if (res?.errMsg?.indexOf('permission') !== -1) {
                    showToast(msg);
                    return reject(new Error(msg));
                }
                showToast(`复制失败：${res?.errMsg}`);
                return reject(new Error(msg));
            }
        });
    });
};
