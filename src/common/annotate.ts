import type { Page } from '@playwright/test';

export const _annotate = (page: Page, interactableElementsSelector: string) =>
	page.evaluate((interactableElementsSelector) => {
		if (Object.hasOwn(window, 'PRETZEL_DUCK')) {
			return;
		}

		Object.assign(window, {
			PRETZEL_DUCK: true,
		});

		const elements = document.querySelectorAll(interactableElementsSelector);

		let annotation = 0;

		for (const element of elements) {
			element.textContent = `${element.textContent} (${annotation})`;

			annotation++;
		}
	}, interactableElementsSelector);
