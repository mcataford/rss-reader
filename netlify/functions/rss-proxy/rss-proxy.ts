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
