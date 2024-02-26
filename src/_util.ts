export const memoize = <T extends (...args: any[]) => any = any>(func: T) => {
    let val;
    let fired;
    return (...args: Parameters<T>): ReturnType<T> => {
        if (!fired) {
            fired = true;
            val = func(...args);
        }
        return val;
    };
};

export const uuid = () => {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
};
