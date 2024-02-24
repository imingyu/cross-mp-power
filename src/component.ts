export const supportSelectOwnerComponent = () => {
    return BUILD_TARGET === 'wx' || BUILD_TARGET === 'my';
};
