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

import { parseFeed } from "htmlparser2";

const defaultHeaders = {
	"Access-Control-Allow-Origin": "https://rss-reader.karnov.club",
};

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

async function fetchHandler(request: Request) {
	const requestUrl = new URL(request.url);
	const proxiedUrl = requestUrl.searchParams.get("url");
	try {
		const responseData = await fetch(proxiedUrl);
		const data = await responseData.text();
		const newFeedData = parseFeed(data);
		const newFeed = processFeedXML(newFeedData);
		const mergedFeeds = newFeed;

		return new Response(JSON.stringify(mergedFeeds), {
			status: 200,
			headers: defaultHeaders,
		});
	} catch (error) {
		return new Response(error.toString(), {
			status: 500,
			headers: defaultHeaders,
		});
	}
}

export default {
	fetch: fetchHandler,
};
