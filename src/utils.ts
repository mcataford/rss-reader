import type { Feed, Item } from "./types";

export default function sortFeedItemsByDate(feeds: Feed[]): Item[] {
	const flattened = feeds.reduce((flattenedFeeds, feed) => {
		const items = feed.items.map((item) => ({
			...item,
			feedTitle: feed.title,
		}));
		flattenedFeeds.push(...items);
		return flattenedFeeds;
	}, []);

	return flattened.sort((first, second) =>
		first.published > second.published ? -1 : 1,
	);
}

export function isDev(): boolean {
	return process.env.NODE_ENV === "development";
}
