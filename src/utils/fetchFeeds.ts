import axios from 'axios'
import { parseFeed } from 'htmlparser2'
import md5 from 'crypto-js/md5'

import type { Item } from '../types'

import { storeRssData, restoreRssData } from './persistence'

function processFeedXML(feed) {
    return feed.items.reduce((items, feedItem) => {
        items.push({
            title: feedItem.title,
            url: feedItem.link,
            published: feedItem.pubDate,
        })

        return items
    }, [])
}

/*
 * Fetches RSS feeds from the given url list. If feed data exists in
 * localStorage, it is used as a basis for the final list and any new
 * items are added on top. If the cache has been updated in the past
 * 10 minutes, no network fetch happens.
 *
 * Returns a list of Item.
 */
export default async function fetchFeeds(
    feedUrls: string[],
    forceRefetch = false,
): Item[] {
    const feed = await Promise.all(
        feedUrls.map(async (url: string) => {
            const urlHash = md5(url)
            const storedFeedData = restoreRssData(url)

            const items = storedFeedData?.items || []
            const lastPush = storedFeedData?.lastPush

            // TODO: Constantize
            if (!forceRefetch && lastPush > Date.now() - 10 * 60 * 1000)
                return items

            const response = await axios.get(url)

            const availableFeedItems = [...items]

            try {
                const newFeedData = parseFeed(response.data)
                const newFeedItems = processFeedXML(newFeedData)
                const seen = new Set(availableFeedItems.map((item) => item.url))

                newFeedItems.forEach((item) => {
                    if (seen.has(item.url)) return

                    availableFeedItems.push(item)
                    seen.add(item.url)
                })
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e)
            }
            storeRssData(url, availableFeedItems)

            return availableFeedItems
        }),
    )

    // TODO: Flattening to be part of the above.
    const flattenedFeed = feed.reduce((acc, items) => {
        acc.push(...items)

        return acc
    }, [])
    return flattenedFeed
}
