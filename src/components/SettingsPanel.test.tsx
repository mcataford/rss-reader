import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, within } from "@testing-library/react";

import { renderComponent as renderComponentInner } from "@/testHelpers/renderUtils";
import * as LocalStorageHook from "@/hooks/useLocalStorage";

import SettingsPanel from "./SettingsPanel";

function renderComponent() {
	return renderComponentInner(SettingsPanel);
}

describe("SettingsPanel", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders a text field to capture user-defined urls", async () => {
		renderComponent();

		const textField = await screen.getByLabelText(/feed urls/i, {
			selector: "textarea",
		});

		expect(textField).toBeInTheDocument();
	});

	it("renders a submission button to save the settings state", async () => {
		renderComponent();

		const submitButton = await screen.getByLabelText(/update feeds/i, {
			selector: "button",
		});

		expect(submitButton).toBeInTheDocument();
		expect(submitButton.textContent).toEqual("Save");
	});

	it("pre-populates text field with saved user-defined urls", async () => {
		const mockSettings = {
			feedUrls: ["test-feed-url.com", "other-test-feed-url.ca"],
		};

		const mockLocalStorage = vi
			.spyOn(LocalStorageHook, "default")
			.mockReturnValue({
				setValue: () => {},
				// biome-ignore lint/suspicious/noExplicitAny: The function usually takes a generic.
				getValue: (key: string): any => {
					if (key === "settings") return mockSettings;

					throw Error("Not implemented.");
				},
			});

		renderComponent();

		const textField = await screen.getByLabelText(/feed urls/i, {
			selector: "textarea",
		});

		expect(textField.textContent).toEqual(mockSettings.feedUrls.join("\n"));
	});

	it("displays parsed urls from user input", async () => {
		const mockSettings = {
			feedUrls: ["test-feed-url.com", "other-test-feed-url.ca"],
		};

		const mockLocalStorage = vi
			.spyOn(LocalStorageHook, "default")
			.mockReturnValue({
				setValue: () => {},
				// biome-ignore lint/suspicious/noExplicitAny: The function usually takes a generic.
				getValue: (key: string): any => {
					if (key === "settings") return mockSettings;

					throw Error("Not implemented.");
				},
			});

		renderComponent();

		// FIXME: Weak assertion / selection of component.
		const parsedUrlCards = await screen.getByRole("list");

		expect(parsedUrlCards.children.length).toEqual(
			mockSettings.feedUrls.length,
		);
		expect(parsedUrlCards.children[0].textContent.trim()).toEqual(
			mockSettings.feedUrls[0],
		);
		expect(parsedUrlCards.children[1].textContent.trim()).toEqual(
			mockSettings.feedUrls[1],
		);
	});

	it.each`
		scenario     | url                          | expectValid
		${"valid"}   | ${"https://www.my-feed.com"} | ${true}
		${"invalid"} | ${"not-a-url"}               | ${false}
	`(
		"displays validation status of saved user-defined urls ($scenario)",
		async ({ url, expectValid }) => {
			const mockSettings = {
				feedUrls: [url],
			};

			const mockLocalStorage = vi
				.spyOn(LocalStorageHook, "default")
				.mockReturnValue({
					setValue: () => {},
					// biome-ignore lint/suspicious/noExplicitAny: The function usually takes a generic.
					getValue: (key: string): any => {
						if (key === "settings") return mockSettings;

						throw Error("Not implemented.");
					},
				});

			renderComponent();

			const validatedUrl = await screen.getByText(url, {
				selector: "[role=listitem]",
			});

			expect(
				within(validatedUrl).getByTestId(
					expectValid ? /CheckCircleOutlineIcon/ : /ErrorOutlineIcon/,
				),
			).toBeInTheDocument();
		},
	);
});
