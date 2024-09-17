import type { Page } from 'playwright';

declare global {
	interface Window {
		isElementVisible: (element: Element) => boolean;
		replaceLast: (text: string, search: string, replacement: string) => string;
	}
}
export const setup = async (page: Page) => {
	await page.addInitScript(() => {
		window.isElementVisible = (element: Element) => {
			if (!element.checkVisibility()) {
				return false;
			}

			const { top, bottom } = element.getBoundingClientRect();

			const viewHeight = Math.max(
				document.documentElement.clientHeight,
				window.innerHeight,
			);

			return !(bottom < 0 || top - viewHeight >= 0);
		};

		window.replaceLast = (str: string, find: string, replace: string) => {
			const index = str.lastIndexOf(find);

			if (index === -1) {
				return str;
			}

			return `${str.substring(0, index)}${replace}${str.substring(
				index + find.length,
			)}`;
		};
	});

	await page.reload();
};
