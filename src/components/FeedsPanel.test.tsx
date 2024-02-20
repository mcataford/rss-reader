import { describe, it, vi, afterEach, expect } from "vitest";
import { screen, within } from "@testing-library/react";

import { renderComponent as renderComponentInner } from "@/testHelpers/renderUtils";
import * as FeedsHook from "@/hooks/useRSSFeeds";

import FeedsPanel from "@/components/FeedsPanel";

function renderComponent() {
	return renderComponentInner(FeedsPanel);
}

describe("FeedsPanel", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});
	it("displays a no-item message if there are no items to display", async () => {
		vi.spyOn(FeedsHook, "default").mockReturnValue({
			feeds: [],
		});

		renderComponent();

		expect(screen.getByText(/nothing to see here/i)).toBeInTheDocument();
	});

	it("display a list of available stories", async () => {
		const mockFeeds = [
			{
				lastPull: "0",
				title: "Feed A",
				items: [
					{
						title: "Item A",
						url: "local.host/item-a",
						published: new Date("2012-12-12"),
						feedTitle: "Feed A",
						source: "",
					},
				],
			},
			{
				lastPull: "0",
				title: "Feed B",
				items: [
					{
						title: "Item B",
						url: "local.host/item-b",
						published: new Date("2012-12-12"),
						feedTitle: "Feed B",
						source: "",
					},
				],
			},
		];

		vi.spyOn(FeedsHook, "default").mockReturnValue({
			feeds: mockFeeds,
		});

		renderComponent();

		// FIXME: Weak selection.
		const feedItems = await screen.getByRole("list");

		expect(feedItems.children.length).toEqual(2);
	});

	describe("ItemCard", () => {
		const mockFeed = {
			lastPull: "0",
			title: "Feed A",
			items: [
				{
					title: "Item A",
					url: "local.host/item-a",
					published: new Date("2012-12-12"),
					feedTitle: "Feed A",
					source: "",
				},
			],
		};

		it("displays the feed title the item is associated with", async () => {
			vi.spyOn(FeedsHook, "default").mockReturnValue({
				feeds: [mockFeed],
			});

			renderComponent();

			// FIXME: Weak selection.
			const feedItem = await screen.getByRole("listitem");

			expect(
				within(feedItem).getByText(new RegExp(mockFeed.title, "i")),
			).toBeInTheDocument();
		});

		it("displays the publication date associated with the item", async () => {
			vi.spyOn(FeedsHook, "default").mockReturnValue({
				feeds: [mockFeed],
			});

			renderComponent();

			// FIXME: Weak selection.
			const feedItem = await screen.getByRole("listitem");

			expect(within(feedItem).getByText(/12\/12\/2012/)).toBeInTheDocument();
		});

		it("displays a clickable link to the full content for the item", async () => {
			vi.spyOn(FeedsHook, "default").mockReturnValue({
				feeds: [mockFeed],
			});

			renderComponent();

			const feedItemLink = await screen.getByLabelText("Open item");

			expect(feedItemLink).toBeInTheDocument();
			expect(feedItemLink.getAttribute("href")).toEqual(mockFeed.items[0].url);
		});
	});
});
