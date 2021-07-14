import React, { ReactNode, useEffect, useReducer } from 'react'

import fetchFeeds from './utils/fetchFeeds'
import NavigationBar from './NavigationBar'
import FeedsPanel from './FeedsPanel'
import SettingsPanel from './SettingsPanel'
import { panelIdentifiers } from './constants'
import { restoreSettings } from './utils/persistence'
import reducer, {
    setActivePanel,
    setFeedUrls,
    setRssItems,
} from './state/reducer'

export default function App(): ReactNode {
    const [state, dispatch] = useReducer(reducer, {
        activePanel: panelIdentifiers.FEEDS,
        rssItems: [],
        feedUrls: [],
    })

    useEffect(() => {
        dispatch(setFeedUrls(restoreSettings().feedUrls))
    }, [])

    useEffect(() => {
        const fetch = async () => {
            const feedItems = await fetchFeeds(state.feedUrls)
            dispatch(setRssItems(feedItems))
        }

        fetch()
    }, [state.feedUrls])

    return (
        <>
            <NavigationBar
                activePanel={state.activePanel}
                setActivePanel={(panel) => dispatch(setActivePanel(panel))}
            />
            {state.activePanel === panelIdentifiers.FEEDS ? (
                <FeedsPanel items={state.rssItems} />
            ) : null}
            {state.activePanel === panelIdentifiers.SETTINGS ? (
                <SettingsPanel
                    feedUrls={state.feedUrls}
                    setFeedUrls={(urls) => dispatch(setFeedUrls(urls))}
                />
            ) : null}
        </>
    )
}
