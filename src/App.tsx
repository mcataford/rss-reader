import React, { ReactNode, useEffect } from 'react'

import fetchFeeds from './utils/fetchFeeds'
import NavigationBar from './NavigationBar'
import FeedsPanel from './FeedsPanel'
import SettingsPanel from './SettingsPanel'
import { panelIdentifiers } from './constants'
import { restoreSettings } from './utils/persistence'
import useAppState from './utils/useAppState'

export default function App(): ReactNode {
    const [state, actions] = useAppState()
    const { setActivePanel, setFeeds, setFeedUrls } = actions

    useEffect(() => {
        if (state.loaded) return

        setFeedUrls(restoreSettings()?.feedUrls ?? [])
    }, [state.loaded, setFeedUrls])

    useEffect(() => {
        const fetch = async () => {
            const feeds = await fetchFeeds(state.feedUrls)
            setFeeds(feeds)
        }

        fetch()
    }, [state.feedUrls, setFeeds])

    return (
        <>
            <NavigationBar
                activePanel={state.activePanel}
                setActivePanel={setActivePanel}
            />
            {state.activePanel === panelIdentifiers.FEEDS ? (
                <FeedsPanel items={state.feeds} />
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
