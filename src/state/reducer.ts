export const SET_PANEL_IDENTIFIER = 'setPanelIdentifier'
export const SET_FEED_URLS = 'setFeedUrls'
export const SET_RSS_ITEMS = 'setRssItems'

export default function reducer(state, action) {
    switch (action.type) {
        case SET_PANEL_IDENTIFIER:
            return { ...state, activePanel: action.payload.panelIdentifier }
        case SET_FEED_URLS:
            return { ...state, feedUrls: action.payload.feedUrls }
        case SET_RSS_ITEMS:
            return { ...state, rssItems: action.payload.rssItems }
        default:
            return state
    }
}

export function setActivePanel(panelIdentifier: string) {
    return {
        type: SET_PANEL_IDENTIFIER,
        payload: { panelIdentifier },
    }
}

export function setFeedUrls(feedUrls: string[]) {
    return {
        type: SET_FEED_URLS,
        payload: { feedUrls },
    }
}

export function setRssItems(rssItems) {
    return {
        type: SET_RSS_ITEMS,
        payload: { rssItems },
    }
}
