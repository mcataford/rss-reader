import { parseFeed } from 'htmlparser2'
import { useQueries } from 'react-query'

import { Feed } from '../types'
import { isDev } from '../utils'

import useLocalStorage from './useLocalStorage'

function mergeFeeds(first, second) {
    // Assuming `second` is newer.
    const seen = new Set(first.items.map((item) => item.url))
    const mergedItems = second.items.reduce(
        (updatedItems, item) => {
            if (!seen.has(item.url)) {
                updatedItems.push(item)
                seen.add(item.url)
            }

            return updatedItems
        },
        [...first.items],
    )
    return {
        ...second,
        items: mergedItems,
    }
}

function processFeedXML(feed): Feed {
    return {
        title: feed.title,
        lastPull: String(Date.now()),
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

async function fetchFeed(
    url: string,
    persistedData: Feed | null,
): Promise<Feed> {
    const response = await fetch(`/.netlify/functions/rss-proxy?url=${url}`)

    const responseData = await response.text()

    try {
        const newFeedData = parseFeed(responseData)
        const newFeed = processFeedXML(newFeedData)
        const mergedFeeds = persistedData
            ? mergeFeeds(persistedData, newFeed)
            : newFeed

        return mergedFeeds
    } catch (e) {
        if (isDev()) {
            // eslint-disable-next-line no-console
            console.error(e)
        }
    }

    return persistedData
}

export default function useRSSFeeds(urls: string[]): { feeds: Feed[] } {
    const { getValue, setValue } = useLocalStorage({ isJSON: true })

    const queries = useQueries(
        urls.map((feedUrl: string) => {
            const localStorageKey = `feed_${feedUrl}`
            const persistedData = getValue<Feed>(localStorageKey)

            return {
                queryKey: ['feed', feedUrl],
                queryFn: () => fetchFeed(feedUrl, persistedData),
                staleTime: 30000,
                onSuccess: (data: Feed) => {
                    setValue(localStorageKey, data)
                },
                initialData: persistedData ?? undefined,
                initialDataUpdatedAt:
                    Number(persistedData?.lastPull) ?? undefined,
            }
        }),
    )

    const fetchedFeeds = queries.reduce((fetchedFeeds: Feed[], current) => {
        if (current.isSuccess && current.data) fetchedFeeds.push(current.data)

        return fetchedFeeds
    }, [])

    return { feeds: fetchedFeeds }
}
