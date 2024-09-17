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

			const { x, y, height, width } = element.getBoundingClientRect();
			const { innerWidth, innerHeight, scrollX, scrollY } = window;

			const elementTop = y + scrollY;
			const elementBottom = elementTop + height;
			const elementLeft = x + scrollX;
			const elementRight = elementLeft + width;

			const viewportTop = scrollY;
			const viewportBottom = innerHeight + scrollY;
			const viewportLeft = scrollX;
			const viewportRight = innerWidth + scrollX;

			const topVisible =
				elementTop >= viewportTop && elementTop <= viewportBottom;
			const bottomVisible =
				elementBottom >= viewportTop && elementBottom <= viewportBottom;
			const leftVisible =
				elementLeft >= viewportLeft && elementLeft <= viewportRight;
			const rightVisible =
				elementRight >= viewportLeft && elementRight <= viewportRight;

			return topVisible || bottomVisible || leftVisible || rightVisible;
		};

		window.replaceLast = (str: string, find: string, replace: string) => {
			const index = str.lastIndexOf(find);

			if (index === -1) {
				return str;
			}

			return `${str.substring(0, index)}${replace}${str.substring(index + find.length)}`;
		};
	});

	await page.reload();
};
