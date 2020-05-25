export const relWidth = (value: number) => {
    return value * window.innerWidth;
}

export const relHeight = (value: number) => {
    return value * window.innerHeight;
}

export const getUniqueIdentifier = () => {
    return new Date().getUTCMilliseconds();
}