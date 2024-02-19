import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";

import { renderComponent as renderComponentInner } from "@/testHelpers/renderUtils";
import * as NavigationHook from "@/hooks/useNavigation";

import NavigationBar from "./NavigationBar";

function renderComponent() {
	return renderComponentInner(NavigationBar);
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
