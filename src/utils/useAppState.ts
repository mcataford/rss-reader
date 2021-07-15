import { useReducer, useRef } from 'react'

import { panelIdentifiers } from '../constants'

export const SET_PANEL_IDENTIFIER = 'setPanelIdentifier'
export const SET_FEED_URLS = 'setFeedUrls'
export const SET_RSS_ITEMS = 'setRssItems'

export const defaultState = {
    loaded: false,
    activePanel: panelIdentifiers.FEEDS,
    rssItems: [],
    feedUrls: [],
}

function reducer(state, action) {
    switch (action.type) {
        case SET_PANEL_IDENTIFIER:
            return { ...state, activePanel: action.payload.panelIdentifier }
        case SET_FEED_URLS:
            return { ...state, loaded: true, feedUrls: action.payload.feedUrls }
        case SET_RSS_ITEMS:
            return { ...state, rssItems: action.payload.rssItems }
        default:
            return state
    }
}

function setActivePanel(panelIdentifier: string) {
    return {
        type: SET_PANEL_IDENTIFIER,
        payload: { panelIdentifier },
    }
}

function setFeedUrls(feedUrls: string[]) {
    return {
        type: SET_FEED_URLS,
        payload: { feedUrls },
    }
}

function setRssItems(rssItems) {
    return {
        type: SET_RSS_ITEMS,
        payload: { rssItems },
    }
}
export default function useAppState() {
    const [state, dispatch] = useReducer(reducer, defaultState)

    const actions = {
        setActivePanel: (panelIdentifier) =>
            dispatch(setActivePanel(panelIdentifier)),
        setFeedUrls: (feedUrls) => dispatch(setFeedUrls(feedUrls)),
        setRssItems: (rssItems) => dispatch(setRssItems(rssItems)),
    }

    const stableActions = useRef(actions)

    return [state, stableActions.current]
}
