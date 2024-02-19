import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationProvider } from "@/hooks/useNavigation";
import * as NavigationHook from "@/hooks/useNavigation";

import NavigationBar from "./NavigationBar";

function Wrappers({ children }) {
	return (
		<NavigationProvider>
			<QueryClientProvider client={new QueryClient()}>
				{children}
			</QueryClientProvider>
		</NavigationProvider>
	);
}

function renderComponent() {
	return {
		...render(<NavigationBar />, { wrapper: Wrappers }),
		user: userEvent.setup(),
	};
}

describe("NavigationBar", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});
	it("renders navigation buttons", async () => {
		renderComponent();

		const buttons = await screen.findAllByRole("button");

		expect(buttons.length).toEqual(2);
		expect(
			screen.getByText(/Your feeds/, { selector: "button" }),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Settings/, { selector: "button" }),
		).toBeInTheDocument();
	});

	it.each`
		destination   | buttonTextPattern | expectedUrl
		${"feeds"}    | ${/Your feeds/}   | ${"/feeds/"}
		${"settings"} | ${/Settings/}     | ${"/settings/"}
	`(
		"clicking navigation buttons triggers navigation ($destination)",
		async ({ buttonTextPattern, expectedUrl }) => {
			const mockPushHistory = vi.spyOn(window.history, "pushState");

			const { user } = renderComponent();

			const feedsButton = await screen.getByText(buttonTextPattern, {
				selector: "button",
			});

			await user.click(feedsButton);

			// The history and location are updated.
			expect(mockPushHistory).toHaveBeenCalledTimes(1);
			expect(mockPushHistory).toHaveBeenCalledWith({}, "", expectedUrl);
			expect(window.location.pathname).toEqual(expectedUrl);
		},
	);

	it.each`
		url             | expectedText
		${"/settings/"} | ${"Settings"}
		${"/feeds/"}    | ${"Your feeds"}
	`(
		"displays the name of the current location",
		async ({ url, expectedText }) => {
			const mockCurrentLocation = vi
				.spyOn(NavigationHook, "default")
				.mockReturnValue({ location: url, navigate: () => {} });

			renderComponent();

			const locationTitle = await screen.getByLabelText("current location");

			expect(locationTitle).toBeInTheDocument();
			expect(locationTitle.textContent).toEqual(expectedText);
		},
	);
});
