import type { Page } from 'playwright';

export const fastScreenshot = async (page: Page) => {
	const context = page.context();
	const browser = context.browser();

	if (!browser) {
		return page.screenshot();
	}

	const name = browser.browserType().name();

	if (name === 'chromium') {
		const { send } = await context.newCDPSession(page);
		const { data } = await send('Page.captureScreenshot');
		return Buffer.from(data, 'base64');
	}

	return page.screenshot();
};
