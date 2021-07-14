import React, { ReactNode } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import { persistSettings } from './utils/persistence'

interface Props {
    feedUrls: string[]
    setFeedUrls: (s: string[]) => void
}

export default function SettingsPanel(props: Props): ReactNode {
    const { feedUrls, setFeedUrls } = props

    return (
        <>
            <TextField
                multiline
                rows={5}
                variant="outlined"
                label="Feed URLs"
                defaultValue={feedUrls.join('\n')}
                onChange={(v) => setFeedUrls(v.target.value.split('\n'))}
            />
            <Button onClick={() => persistSettings({ feedUrls: feedUrls })}>
                Save
            </Button>
        </>
    )
}
