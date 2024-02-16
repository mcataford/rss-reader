import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import useRSSFeeds from "./hooks/useRSSFeeds";
import useSettings from "./hooks/useSettings";
import sortFeedItemsByDate from "./utils";

interface CardProps {
	title: string;
	url: string;
	published: Date;
	feedTitle: string;
}

const root = {
	margin: "5px",
	padding: "10px",
	display: "flex",
	flexDirection: "column",
};

function ItemCard(props: CardProps) {
	const { title, url, published, feedTitle } = props;

	const formattedDate = new Date(published).toLocaleString("en-GB", {
		timeZone: "UTC",
	});
	return (
		<Card sx={root}>
			<a href={url}>{title}</a>
			<span>{`${feedTitle} - ${formattedDate}`}</span>
		</Card>
	);
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
				Add some feeds in the <strong>Settings</strong> panel to get started!
			</Typography>
		</Box>
	);
}

export default function FeedsPanel() {
	const { getSettings } = useSettings();
	const settings = getSettings();
	const { feeds } = useRSSFeeds(settings.feedUrls);

	const flattenedItems = sortFeedItemsByDate(feeds);

	const cardList = flattenedItems.map((item) => (
		<ItemCard {...item} key={`feed_item_${item.title.replace(" ", "_")}`} />
	));

	return (
		<Box display="flex" flexDirection="column">
			{cardList.length > 0 ? cardList : <NoItemsNotice />}
		</Box>
	);
}
