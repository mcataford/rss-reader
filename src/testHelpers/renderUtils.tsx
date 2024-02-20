import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TestComponentWrapper } from "./components";

export function renderComponent<ComponentProps>(
	Component,
	props?: ComponentProps,
) {
	return {
		...render(<Component {...(props ?? {})} />, {
			wrapper: TestComponentWrapper,
		}),
		user: userEvent.setup(),
	};
}
