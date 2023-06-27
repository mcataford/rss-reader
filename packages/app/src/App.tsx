import { FunctionComponent } from 'preact'

import FeedsPanel from './FeedsPanel'
import NavigationBar from './NavigationBar'
import SettingsPanel from './SettingsPanel'
import useNavigation, { routes } from './hooks/useNavigation'

export default function App(): FunctionComponent {
    const { location } = useNavigation()

    return (
        <>
            <NavigationBar />
            {location === routes.FEEDS ? <FeedsPanel /> : null}
            {location === routes.SETTINGS ? <SettingsPanel /> : null}
        </>
    )
}
