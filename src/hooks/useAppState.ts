import { useReducer, useRef } from 'preact/hooks'

import type { State } from '../types'
import { panelIdentifiers } from '../constants'

export const SET_PANEL_IDENTIFIER = 'setPanelIdentifier'
export const SET_FEED_URLS = 'setFeedUrls'
export const SET_FEEDS = 'setFeeds'

export const defaultState = {
    loaded: false,
    activePanel: panelIdentifiers.FEEDS,
    feeds: [],
    feedUrls: [],
}

function reducer(state, action) {
    switch (action.type) {
        case SET_PANEL_IDENTIFIER:
            return { ...state, activePanel: action.payload.panelIdentifier }
        case SET_FEED_URLS:
            return { ...state, loaded: true, feedUrls: action.payload.feedUrls }
        case SET_FEEDS:
            return { ...state, feeds: action.payload.feeds }
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

function setFeeds(feeds) {
    return {
        type: SET_FEEDS,
        payload: { feeds },
    }
}

type Action =
    | ReturnType<setFeeds>
    | ReturnType<setFeedUrls>
    | ReturnType<setActivePanel>

interface ActionSet {
    [key: string]: Action
}

export default function useAppState(): [State, ActionSet] {
    const [state, dispatch] = useReducer(reducer, defaultState)

    const actions = {
        setActivePanel: (panelIdentifier) =>
            dispatch(setActivePanel(panelIdentifier)),
        setFeedUrls: (feedUrls) => dispatch(setFeedUrls(feedUrls)),
        setFeeds: (feeds) => dispatch(setFeeds(feeds)),
    }

    const stableActions = useRef(actions)

    return [state, stableActions.current]
}
