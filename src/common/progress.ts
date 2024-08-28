import type { Locator } from '@playwright/test';

export const progress = async (element: Locator) =>
	element.evaluate((element) => {
		if (!element.textContent) {
			return;
		}

		element.textContent = element.textContent.replace(/\s\(\d+\)/, '');
	});
