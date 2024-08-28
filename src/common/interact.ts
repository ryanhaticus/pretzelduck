import type { Page } from '@playwright/test';
import type { Interaction } from '../schemas/Interaction';

export const _interact = async (page: Page, interaction: Interaction) => {
	const { type } = interaction;

	/* Generic Interactions */
	if (type === 'scroll') {
		await page.evaluate(() => {
			window.scrollBy(0, window.innerHeight);
		});
		return;
	}

	/* Element Interactions */
	const { annotation } = interaction;

	const element = await page.getByText(`(${annotation})`);

	if (type === 'click') {
		await element.click();
		return element;
	}

	if (type === 'input') {
		const { value } = interaction;

		await element.fill(value);
		return element;
	}
};
