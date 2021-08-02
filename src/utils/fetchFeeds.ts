import { parseFeed } from 'htmlparser2'

import type { Feed } from '../types'

import { restoreRssData, storeRssData } from './persistence'

function processFeedXML(feed) {
    return {
        title: feed.title,
        lastPull: Date.now(),
        items: feed.items.reduce((items, feedItem) => {
            items.push({
                title: feedItem.title,
                url: feedItem.link,
                published: new Date(feedItem.pubDate),
            })

            return items
        }, []),
    }
}

function getRefetchThreshold() {
    const refetchThreshold = new Date()
    refetchThreshold.setMinutes(refetchThreshold.getMinutes() - 10)
    return refetchThreshold
}

function mergeFeeds(first, second) {
    // Assuming `second` is newer.
    const seen = new Set(items.map((item) => item.url))
    const mergedItems = newFeedItems.reduce((updatedItems, item) => {
        if (!seen.has(item.url)) {
            updatedItems.push(item)
            seen.add(item.url)
        }

        return updatedItems
    }, [])
    return {
        ...second,
        items: mergedItems,
    }
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
): Feed[] {
    const feeds = await Promise.all(
        feedUrls.map(async (url: string) => {
            const storedFeedData = restoreRssData(url)

            // Skip refetch if not stale / not forced
            const lastPull = storedFeedData?.lastPull
            if (!forceRefetch && lastPull > getRefetchThreshold())
                return storedFeedData

            const response = await fetch(
                `/.netlify/functions/rss-proxy?url=${url}`,
            )

            if (!response.ok) return storedFeedData

            const responseData = await response.text()

            try {
                const newFeedData = parseFeed(responseData)
                const newFeed = processFeedXML(newFeedData)
                const mergedFeeds = storedFeedData
                    ? mergeFeeds(storedFeedData, newFeed)
                    : newFeed

                storeRssData(url, mergedFeeds)
                return mergedFeeds
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e.response)
            }

            return storedFeedData
        }),
    )

    return feeds.filter((feed) => feed)
}
