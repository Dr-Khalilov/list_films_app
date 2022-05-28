export const getCacheFromNode = async (
    key: string,
    data: object,
    ttl = 15000,
) => {
    const cache = new Map();
    if (!cache.has(key)) {
        cache.set(key, data);
    }
    return await cache.get(key);
};
