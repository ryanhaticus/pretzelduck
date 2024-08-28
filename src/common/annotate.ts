import type { Page } from '@playwright/test';

export const _annotate = (page: Page, interactableElementsSelector: string) =>
	page.evaluate((interactableElementsSelector) => {
		const elements = document.querySelectorAll(interactableElementsSelector);

		let annotation = 0;

		for (const element of elements) {
			annotation++;

			if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
				const type = element.getAttribute('type');

				if (type === 'button' || type === 'submit') {
					const value = element.getAttribute('value');

					element.setAttribute('value', `${value} (${annotation})`);

					continue;
				}

				const placeholder = element.getAttribute('placeholder');

				element.setAttribute('placeholder', `${placeholder} (${annotation})`);

				continue;
			}

			element.textContent = `${element.textContent} (${annotation})`;
		}
	}, interactableElementsSelector);
