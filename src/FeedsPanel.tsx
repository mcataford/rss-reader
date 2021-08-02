import { FunctionComponent } from 'preact'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
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

function ItemCard(props: CardProps) {
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

function NoItemsNotice() {
    return (
        <Box
            alignSelf="center"
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="50px"
        >
            <Typography variant="h6">Nothing to see here!</Typography>
            <Typography>
                Add some feeds in the <strong>Settings</strong> panel to get
                started!
            </Typography>
        </Box>
    )
}

export default function FeedsPanel(props: Props): FunctionComponent<Props> {
    const { feeds } = props

    const flattenedItems = sortFeedItemsByDate(feeds)

    const cardList = flattenedItems.map((item) => (
        <ItemCard {...item} key={`feed_item_${item.title.replace(' ', '_')}`} />
    ))

    return (
        <Box display="flex" flexDirection="column">
            {cardList.length > 0 ? cardList : <NoItemsNotice />}
        </Box>
    )
}
