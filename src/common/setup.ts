import type { Page } from 'playwright';
import { isElementVisible } from './utils/isElementVisible';
import { replaceLast } from './utils/replaceLast';

declare global {
	interface Window {
		isElementVisible: (element: Element) => boolean;
		replaceLast: (text: string, search: string, replacement: string) => string;
	}
}
export const setup = async (page: Page) => {
	await page.addInitScript(
		({ isElementVisible, replaceLast }) => {
			window.isElementVisible = isElementVisible;
			window.replaceLast = replaceLast;
		},
		{
			isElementVisible,
			replaceLast,
		},
	);

	await page.reload();
};
