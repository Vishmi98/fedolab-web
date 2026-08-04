import { redis } from "./redis";

export async function getCache<T>(key: string): Promise<T | null> {
    const value = await redis.get<T>(key);
    console.log("GET CACHE:", key, value ? "FOUND" : "NOT FOUND");
    return value;
}

export async function setCache(
    key: string,
    value: unknown,
    ttl = 600
) {
    console.log("SET CACHE:", key);

    await redis.set(key, value, {
        ex: ttl,
    });

    console.log("CACHE SAVED");
}

export async function deleteCache(key: string) {
    console.log("DELETE CACHE:", key);
    await redis.del(key);
}

export async function clearBlogCache() {
    const keys = await redis.keys(
        "blogs:*"
    );

    if (keys.length > 0) {
        console.log(
            "CLEAR BLOG CACHE:",
            keys
        );
        await redis.del(
            ...keys
        );
    }
}