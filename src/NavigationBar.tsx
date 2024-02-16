import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import useNavigation, { routes } from "./hooks/useNavigation";

const title = {
	flexGrow: 1
}

const routePrettyNames = {
	[routes.SETTINGS]: "Settings",
	[routes.FEEDS]: "Your feeds",
};

export default function NavigationBar() {
	const { location, navigate } = useNavigation();

	return (
		<>
			<AppBar position="fixed">
				<Toolbar>
                    <Typography variant="h6" style={title}>
						{routePrettyNames[location]}
					</Typography>
					<Button
						key={"navigation-feeds"}
						color="inherit"
						onClick={() => navigate(routes.FEEDS)}
					>
						{routePrettyNames[routes.FEEDS]}
					</Button>
					<Button
						key={"navigation-settings"}
						color="inherit"
						onClick={() => navigate(routes.SETTINGS)}
					>
						{routePrettyNames[routes.SETTINGS]}
					</Button>
				</Toolbar>
			</AppBar>
            <div style={{ minHeight: '64px' }}/>
		</>
	);
}
