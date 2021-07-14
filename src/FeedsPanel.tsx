import React, { ReactNode } from 'react'
import Box from '@material-ui/core/Box'

import ItemCard from './ItemCard'
import type { Item } from './types'

interface Props {
    items: Item[]
}

export default function FeedsPanel(props: Props): ReactNode {
    const { items } = props
    return (
        <Box display="flex" flexDirection="column">
            {items.map((item) => (
                <ItemCard
                    key={`feed_item_${item.title.replace(' ', '_')}`}
                    {...item}
                />
            ))}
        </Box>
    )
}
