import React, { ReactNode } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import { panelIdentifiers, readablePanelIdentifiers } from './constants'

interface NavigationBarProps {
    activePanel: string
    setActivePanel: (s: string) => void
}

const useStyles = makeStyles((theme) => ({
    offset: theme.mixins.toolbar,
    title: { flexGrow: 1 },
}))

function getAvailableDestinations(activePanel: string): string[] {
    return Object.values(panelIdentifiers).filter(
        (label) => activePanel !== label,
    )
}

export default function NavigationBar(props: NavigationBarProps): ReactNode {
    const { activePanel, setActivePanel } = props

    const classes = useStyles()

    const availableDestinations = getAvailableDestinations(activePanel)
    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography
                        edge="start"
                        variant="h6"
                        className={classes.title}
                    >
                        {readablePanelIdentifiers[activePanel]}
                    </Typography>
                    {availableDestinations.map((panelIdentifier) => (
                        <Button
                            key={`navigation_${panelIdentifier}`}
                            color="inherit"
                            onClick={() => setActivePanel(panelIdentifier)}
                        >
                            {readablePanelIdentifiers[panelIdentifier]}
                        </Button>
                    ))}
                </Toolbar>
            </AppBar>
            <div className={classes.offset} />
        </>
    )
}
