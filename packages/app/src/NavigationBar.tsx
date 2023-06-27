import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { FunctionComponent } from 'preact'

import useNavigation, { routes } from './hooks/useNavigation'

const useStyles = makeStyles((theme) => ({
    offset: theme.mixins.toolbar,
    title: { flexGrow: 1 },
}))

const routePrettyNames = {
    [routes.SETTINGS]: 'Settings',
    [routes.FEEDS]: 'Your feeds',
}

export default function NavigationBar(): FunctionComponent {
    const { location, navigate } = useNavigation()

    const classes = useStyles()

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography
                        edge="start"
                        variant="h6"
                        className={classes.title}
                    >
                        {routePrettyNames[location]}
                    </Typography>
                    <Button
                        key={'navigation-feeds'}
                        color="inherit"
                        onClick={() => navigate(routes.FEEDS)}
                    >
                        {routePrettyNames[routes.FEEDS]}
                    </Button>
                    <Button
                        key={'navigation-settings'}
                        color="inherit"
                        onClick={() => navigate(routes.SETTINGS)}
                    >
                        {routePrettyNames[routes.SETTINGS]}
                    </Button>
                </Toolbar>
            </AppBar>
            <div className={classes.offset} />
        </>
    )
}
