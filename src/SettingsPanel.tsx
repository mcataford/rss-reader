import React, { ReactNode, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

import { storeSettings } from './utils/persistence'

interface Props {
    feedUrls: string[]
    setFeedUrls: (s: string[]) => void
}

const useStyles = makeStyles({
    urlCard: {
        margin: '5px',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
})

function isValidUrl(url: string): boolean {
    const urlPattern = /(https?:\/\/)?(www\.)?[\w.-_]+\.[a-zA-Z]{2,3}/

    return urlPattern.test(url)
}

export default function SettingsPanel(props: Props): ReactNode {
    const { feedUrls, setFeedUrls } = props
    const [feedUrlsForm, setFeedUrlsForm] = useState(feedUrls)

    const classes = useStyles()
    const urlCards = feedUrlsForm.map((url) => (
        <Card key={`url_${url}`} variant="outlined" className={classes.urlCard}>
            {isValidUrl(url) ? (
                <CheckCircleOutlineIcon color="primary" />
            ) : (
                <ErrorOutlineIcon color="error" />
            )}{' '}
            {url}
        </Card>
    ))

    return (
        <Box display="flex" flexDirection="column">
            <Typography paragraph>
                {
                    'Enter URLs to fetch feeds from. Invalid URLs are discarded on save.'
                }
            </Typography>
            <TextField
                multiline
                rows={5}
                variant="outlined"
                label="Feed URLs"
                fullWidth
                value={feedUrlsForm.join('\n')}
                onChange={(v) => setFeedUrlsForm(v.target.value.split('\n'))}
            />
            <Box display="flex" flexDirection="column">
                {urlCards}
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    const validUrls = feedUrlsForm.filter(isValidUrl)
                    setFeedUrls(validUrls)
                    setFeedUrlsForm(validUrls)
                    storeSettings({ feedUrls: validUrls })
                }}
            >
                Save
            </Button>
        </Box>
    )
}
