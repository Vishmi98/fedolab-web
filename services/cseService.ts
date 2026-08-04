/* eslint-disable @typescript-eslint/no-explicit-any */
const CSE_BASE_URL = 'https://www.cse.lk/api';
const TIMEOUT_MS = 8000;
const MAX_RETRIES = 2;
const CACHE_TTL_MS = 60 * 1000; // 1 minute TTL

interface CacheStore {
    data: any;
    timestamp: number;
}

const cache: Record<string, CacheStore> = {};

async function fetchWithRetryAndTimeout(
    url: string,
    bodyData?: Record<string, any>,
    retries = MAX_RETRIES
): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const formData = new URLSearchParams();
        if (bodyData) {
            Object.entries(bodyData).forEach(([key, val]) => formData.append(key, String(val)));
        }

        const response = await fetch(url, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString() || undefined,
            cache: 'no-store',
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get('content-type');
        if (!response.ok || (contentType && contentType.includes('text/html'))) {
            throw new Error(`Invalid response from CSE API (Status: ${response.status})`);
        }

        return await response.json();
    } catch (err: any) {
        clearTimeout(timeoutId);
        console.error(`[CSE API Fetch Error] Failed requesting ${url}. Retries left: ${retries}. Error:`, err.message || err);
        if (retries > 0) {
            return fetchWithRetryAndTimeout(url, bodyData, retries - 1);
        }
        throw err;
    }
}

export async function getCseData(endpoint: string, cacheKey: string, bodyData?: Record<string, any>) {
    const now = Date.now();
    const cachedItem = cache[cacheKey];

    // Serve fresh cached data if within TTL
    if (cachedItem && (now - cachedItem.timestamp) < CACHE_TTL_MS) {
        return {
            data: cachedItem.data,
            lastUpdated: new Date(cachedItem.timestamp).toISOString(),
            cached: true,
        };
    }

    try {
        const freshData = await fetchWithRetryAndTimeout(`${CSE_BASE_URL}${endpoint}`, bodyData);
        cache[cacheKey] = { data: freshData, timestamp: now };
        return { data: freshData, lastUpdated: new Date(now).toISOString(), cached: false };
    } catch (error) {
        console.error(`[CSE API Error] Failed fetching ${endpoint}:`, error);

        // Fallback to stale cache if available when API is down
        if (cachedItem) {
            return {
                data: cachedItem.data,
                lastUpdated: new Date(cachedItem.timestamp).toISOString(),
                cached: true,
                warning: 'Showing cached data due to CSE API unavailability.',
            };
        }

        throw new Error('Market data is temporarily unavailable. Please try again later.');
    }
}