import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useState } from "react";

import { css } from "@emotion/react";

import useSettings from "@/hooks/useSettings";

const urlCard = {
	margin: "5px",
	padding: "5px",
	display: "flex",
	alignItems: "center",
	gap: "5px",
};
function isValidUrl(url: string): boolean {
	const urlPattern = /(https?:\/\/)?(www\.)?[\w.-_]+\.[a-zA-Z]{2,3}/;

	return urlPattern.test(url);
}

export default function SettingsPanel() {
	const { getSettings, setSettings } = useSettings();
	const settings = getSettings();
	const [feedUrlsForm, setFeedUrlsForm] = useState(settings.feedUrls);

	const urlCards = feedUrlsForm.map((url) => {
		const isValid = isValidUrl(url);

		return (
			<Card
				key={`url_${url}`}
				variant="outlined"
				style={urlCard}
				role="listitem"
			>
				{isValid ? (
					<CheckCircleOutlineIcon color="primary" />
				) : (
					<ErrorOutlineIcon color="error" />
				)}{" "}
				{url}
			</Card>
		);
	});

	return (
		<Box display="flex" flexDirection="column">
			<Typography paragraph>
				{"Enter URLs to fetch feeds from. Invalid URLs are discarded on save."}
			</Typography>
			<TextField
				multiline
				rows={5}
				variant="outlined"
				label="Feed URLs"
				fullWidth
				value={feedUrlsForm.join("\n")}
				onChange={(v) => setFeedUrlsForm(v.target.value.split("\n"))}
			/>
			<Box display="flex" flexDirection="column" role="list">
				{urlCards}
			</Box>
			<Button
				variant="contained"
				color="primary"
				aria-label="update feeds"
				onClick={() => {
					const validUrls = feedUrlsForm.filter(isValidUrl);
					setSettings<string[]>("feedUrls", validUrls);
					setFeedUrlsForm(validUrls);
				}}
			>
				Save
			</Button>
		</Box>
	);
}
