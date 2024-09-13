import type { Page } from '@playwright/test';
import type { Interaction } from '../schemas/Interaction';

export const _interact = async (page: Page, interaction: Interaction) => {
	const { type } = interaction;

	/* Generic Interactions */
	if (type === 'wait') {
		return;
	}

	if (type === 'scroll') {
		const { direction, numberOfPixels } = interaction;

		await page.evaluate(
			({ direction, numberOfPixels }) => {
				const absoluteNumberOfPixels = Math.abs(numberOfPixels);

				switch (direction) {
					case 'up':
						window.scrollBy(0, absoluteNumberOfPixels);
						break;
					case 'down':
						window.scrollBy(0, absoluteNumberOfPixels);
						break;
					case 'right':
						window.scrollBy(absoluteNumberOfPixels, 0);
						break;
					case 'left':
						window.scrollBy(absoluteNumberOfPixels, 0);
						break;
				}
			},
			{
				direction,
				numberOfPixels,
			},
		);

		return;
	}

	if (type === 'enter') {
		await page.keyboard.press('Enter');

		return;
	}

	/* Element Interactions */
	const { annotation } = interaction;

	const element = await page.locator(
		`[x-pretzelduck-annotation="(PD:${annotation})"]`,
	);

	if (type === 'click') {
		await element.dispatchEvent('click');

		return element;
	}

	if (type === 'input') {
		const { value } = interaction;

		await element.fill(value);

		return element;
	}
};
