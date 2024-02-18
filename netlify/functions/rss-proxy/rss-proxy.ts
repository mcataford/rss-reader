/*
 * Fetches and parses RSS feeds.
 *
 * This handles the fetching, XML parsing and formatting of
 * RSS feed data so that the frontent clients do not have to.
 *
 * This is operating on a "by-feed" basis such that each
 * run only processes one feed, and the clients are expected
 * to make multiple requests if they have a list of feeds to
 * follow.
 */

import axios from 'axios'
import { parseFeed } from 'htmlparser2'

function processFeedXML(feed) {
	return {
		title: feed.title,
		lastPull: String(Date.now()),
		items: feed.items.reduce((items, feedItem) => {
			items.push({
				title: feedItem.title,
				url: feedItem.link,
				published: new Date(feedItem.pubDate),
			});

			return items;
		}, []),
	};
}

const handler = async (event) => {
    try {
        const url = event.queryStringParameters.url
        const responseData = await axios.get(url)
        const newFeedData = parseFeed(responseData.data);
		const newFeed = processFeedXML(newFeedData);
		const mergedFeeds = newFeed;

        return {
            statusCode: 200,
            body: JSON.stringify(mergedFeeds),
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }
