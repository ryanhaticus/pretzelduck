import type { Page } from 'playwright';

import { isElementVisible } from './utils/isElementVisible';

declare global {
	interface Window {
		isElementVisible: typeof isElementVisible;
	}
}
export const setup = async (page: Page) => {
	await page.exposeFunction('isElementVisible', isElementVisible);
};
