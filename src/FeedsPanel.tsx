import React, { ReactNode } from 'react'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'

import sortFeedItemsByDate from './utils/sortFeedItemsByDate'
import type { Feed } from './types'

interface Props {
    feeds: Feed[]
}
interface CardProps {
    title: string
    url: string
    published: Date
    feedTitle: string
}

const useStyles = makeStyles({
    root: {
        margin: '5px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
    },
})

function ItemCard(props: CardProps): ReactNode {
    const { title, url, published, feedTitle } = props
    const classes = useStyles()

    const formattedDate = new Date(published).toLocaleString('en-GB', {
        timeZone: 'UTC',
    })
    return (
        <Card className={classes.root}>
            <a href={url}>{title}</a>
            <span>{`${feedTitle} - ${formattedDate}`}</span>
        </Card>
    )
}

export default function FeedsPanel(props: Props): ReactNode {
    const { feeds } = props

    const flattenedItems = sortFeedItemsByDate(feeds)

    return (
        <Box display="flex" flexDirection="column">
            {flattenedItems.map((item) => (
                <ItemCard
                    {...item}
                    key={`feed_item_${item.title.replace(' ', '_')}`}
                />
            ))}
        </Box>
    )
}
