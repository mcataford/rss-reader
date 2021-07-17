import React, { ReactNode } from 'react'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'

import type { Item } from './types'

interface Props {
    items: Item[]
}
interface CardProps {
    title: string
    url: string
    published: Date
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
    const { title, url, published } = props
    const classes = useStyles()

    const formattedDate = published.toLocaleString('en-GB', { timeZone: 'UTC' })
    return (
        <Card className={classes.root}>
            <a href={url}>{title}</a>
            <span>{formattedDate}</span>
        </Card>
    )
}
export default function FeedsPanel(props: Props): ReactNode {
    const { items } = props
    return (
        <Box display="flex" flexDirection="column">
            {items.map((item) => (
                <ItemCard
                    {...item}
                    key={`feed_item_${item.title.replace(' ', '_')}`}
                />
            ))}
        </Box>
    )
}
