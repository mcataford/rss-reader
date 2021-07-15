export interface Item {
    title: string
    url: string
    published: Date
}

export interface State {
    loaded: boolean
    rssItems: Item[]
    feedUrls: string[]
    activePanel: string
}
