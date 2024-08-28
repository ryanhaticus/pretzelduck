import type { Page } from '@playwright/test';
import type { Interaction } from '../schemas/Interaction';

export const _interact = async (page: Page, interaction: Interaction) => {
	const { type } = interaction;

	/* Element Interactions */
	const { annotation } = interaction;

	const element = await page
		.locator(`[placeholder*="(${annotation})"]`)
		.or(page.locator(`[value*="(${annotation})"]`))
		.or(page.getByText(`(${annotation})`));

	if (type === 'click') {
		await element.click();
		return element;
	}

	if (type === 'input') {
		const { value } = interaction;

		await element.fill(value);
		return element;
	}

	await page.waitForLoadState('networkidle');
};
