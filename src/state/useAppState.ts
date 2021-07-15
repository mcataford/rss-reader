import { useReducer, useRef } from 'react'

import reducer, {
    defaultState,
    setActivePanel,
    setFeedUrls,
    setRssItems,
} from './reducer'

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
