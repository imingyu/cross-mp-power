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
