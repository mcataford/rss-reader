import { useQueries } from "@tanstack/react-query";

import { Feed } from "../types";
import { isDev } from "../utils";

import useLocalStorage from "./useLocalStorage";

function mergeFeeds(first, second) {
	// Assuming `second` is newer.
	const seen = new Set(first.items.map((item) => item.url));
	const mergedItems = second.items.reduce(
		(updatedItems, item) => {
			if (!seen.has(item.url)) {
				updatedItems.push(item);
				seen.add(item.url);
			}

			return updatedItems;
		},
		[...first.items],
	);
	return {
		...second,
		items: mergedItems,
	};
}

async function fetchFeed(
	url: string,
	persistedData: Feed | null,
): Promise<Feed> {
	const response = await fetch(
		`https://rss-reader-api.karnov.club/?url=${url}`,
	);

	const responseData = await response.text();

	try {
		const fetched = JSON.parse(responseData);
		const mergedFeeds = persistedData
			? mergeFeeds(persistedData, fetched)
			: fetched;
		return mergedFeeds;
	} catch (e) {
		if (isDev()) {
			console.error(e);
		}
	}

	return persistedData;
}

export default function useRSSFeeds(urls: string[]): { feeds: Feed[] } {
	const { getValue, setValue } = useLocalStorage({ isJSON: true });

	const queries = useQueries({
		queries: urls.map((feedUrl: string) => {
			const localStorageKey = `feed_${feedUrl}`;
			const persistedData = getValue<Feed>(localStorageKey);

			return {
				queryKey: ["feed", feedUrl],
				queryFn: () => fetchFeed(feedUrl, persistedData),
				staleTime: 30000,
				onSuccess: (data: Feed) => {
					setValue(localStorageKey, data);
				},
				initialData: persistedData ?? undefined,
				initialDataUpdatedAt: Number(persistedData?.lastPull) ?? undefined,
			};
		}),
	});

	const fetchedFeeds = queries.reduce((fetchedFeeds: Feed[], current) => {
		if (current.isSuccess && current.data) fetchedFeeds.push(current.data);

		return fetchedFeeds;
	}, []);

	return { feeds: fetchedFeeds };
}
