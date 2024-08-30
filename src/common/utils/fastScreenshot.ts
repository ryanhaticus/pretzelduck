import type { Page } from 'playwright';

export const fastScreenshot = async (page: Page) => {
	const context = page.context();
	const browser = context.browser();

	if (!browser) {
		return page.screenshot();
	}

	const name = browser.browserType().name();

	if (name === 'chromium') {
		const session = await page.context().newCDPSession(page);
		const { data } = await session.send('Page.captureScreenshot');

		return Buffer.from(data, 'base64');
	}

	return page.screenshot();
};
