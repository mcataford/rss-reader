import React, { ReactNode, useEffect } from 'react'

import fetchFeeds from './utils/fetchFeeds'
import NavigationBar from './NavigationBar'
import FeedsPanel from './FeedsPanel'
import SettingsPanel from './SettingsPanel'
import { panelIdentifiers } from './constants'
import { restoreSettings } from './utils/persistence'
import useAppState from './state/useAppState'

export default function App(): ReactNode {
    const [state, actions] = useAppState()
    const { setActivePanel, setRssItems, setFeedUrls } = actions

    useEffect(() => {
        if (state.loaded) return

        setFeedUrls(restoreSettings().feedUrls)
    }, [state.loaded, setFeedUrls])

    useEffect(() => {
        const fetch = async () => {
            const feedItems = await fetchFeeds(state.feedUrls)
            setRssItems(feedItems)
        }

        fetch()
    }, [state.feedUrls, setRssItems])

    return (
        <>
            <NavigationBar
                activePanel={state.activePanel}
                setActivePanel={setActivePanel}
            />
            {state.activePanel === panelIdentifiers.FEEDS ? (
                <FeedsPanel items={state.rssItems} />
            ) : null}
            {state.activePanel === panelIdentifiers.SETTINGS ? (
                <SettingsPanel
                    feedUrls={state.feedUrls}
                    setFeedUrls={setFeedUrls}
                />
            ) : null}
        </>
    )
}
