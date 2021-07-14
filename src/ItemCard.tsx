import React, { ReactNode } from 'react'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'

interface CardProps {
    title: string
    url: string
    published: Date
}

const useStyles = makeStyles({
    root: {
        margin: '5px',
        display: 'flex',
        flexDirection: 'column',
    },
})

function formatDate(date: Date): string {
    return date.toLocaleString('en-GB', { timeZone: 'UTC' })
}

export default function ItemCard(props: CardProps): ReactNode {
    const { title, url, published } = props
    const classes = useStyles()
    return (
        <Card className={classes.root}>
            <a href={url}>{title}</a>
            <span>{formatDate(published)}</span>
        </Card>
    )
}
