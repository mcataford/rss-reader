import type { RSSData, Settings } from '../types'

const SETTINGS_KEY = 'settings'
const RSS_DATA_KEY_PREFIX = 'savedItems_'

function cacheKeyFromURL(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

function storeToLocal(key: string, data): void {
    window.localStorage.setItem(key, JSON.stringify(data))
}

function restoreFromLocal(key: string) {
    const restored = window.localStorage.getItem(key)
    try {
        return JSON.parse(restored)
    } catch (e) {
        return null
    }
}
export function storeSettings(settings: Settings): void {
    return storeToLocal(SETTINGS_KEY, settings)
}

export function restoreSettings(): Settings {
    return restoreFromLocal(SETTINGS_KEY)
}

export function storeRssData(url: string, items: Item[]): void {
    const key = RSS_DATA_KEY_PREFIX + cacheKeyFromURL(url)
    storeToLocal(key, items)
}

export function restoreRssData(url: string): RSSData {
    const key = RSS_DATA_KEY_PREFIX + cacheKeyFromURL(url)
    return restoreFromLocal(key)
}
