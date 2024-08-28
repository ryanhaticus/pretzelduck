import type { Locator } from '@playwright/test';

export const progress = async (element: Locator) =>
	element.evaluate((element) => {
		if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
			const type = element.getAttribute('type');

			if (type === 'button' || type === 'submit') {
				const value = element.getAttribute('value');

				if (!value) {
					return;
				}

				element.setAttribute('value', value.replace(/\s\(\d+\)/, ''));

				return;
			}

			const placeholder = element.getAttribute('placeholder');

			if (!placeholder) {
				return;
			}

			element.setAttribute('placeholder', placeholder.replace(/\s\(\d+\)/, ''));

			return;
		}

		if (!element.textContent) {
			return;
		}

		element.textContent = element.textContent.replace(/\s\(\d+\)/, '');
	});
