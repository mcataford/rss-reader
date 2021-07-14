export function persistSettings(settings) {
    window.localStorage.setItem('settings', JSON.stringify(settings))
}

export function restoreSettings() {
    return JSON.parse(window.localStorage.getItem('settings') ?? {})
}

export function persistResults(h: string, items: Item[]) {
    window.localStorage.setItem(
        `savedItems_${h}`,
        JSON.stringify({ items, lastPush: Date.now() }),
    )
}

export function restoreResults(key): Item[] {
    return JSON.parse(window.localStorage.getItem(`savedItems_${key}`))
}
