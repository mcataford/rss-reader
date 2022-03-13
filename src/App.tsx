import { FunctionComponent } from 'preact'

import useNavigation, { routes } from './hooks/useNavigation'
import NavigationBar from './NavigationBar'
import FeedsPanel from './FeedsPanel'
import SettingsPanel from './SettingsPanel'

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
