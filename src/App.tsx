import { FunctionComponent } from 'preact'

import useAppState from './hooks/useAppState'
import NavigationBar from './NavigationBar'
import FeedsPanel from './FeedsPanel'
import SettingsPanel from './SettingsPanel'
import { panelIdentifiers } from './constants'

export default function App(): FunctionComponent {
    const [state, actions] = useAppState()
    const { setActivePanel } = actions

    return (
        <>
            <NavigationBar
                activePanel={state.activePanel}
                setActivePanel={setActivePanel}
            />
            {state.activePanel === panelIdentifiers.FEEDS ? (
                <FeedsPanel />
            ) : null}
            {state.activePanel === panelIdentifiers.SETTINGS ? (
                <SettingsPanel />
            ) : null}
        </>
    )
}
