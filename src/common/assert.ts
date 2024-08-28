import type { Page } from '@playwright/test';
import { type LanguageModel, generateObject } from 'ai';
import { Assertion } from '../schemas/Assertion';

export const _assert = async (
	languageModel: LanguageModel,
	page: Page,
	assertion: string,
	maxRetriesPerAssertion: number,
) => {
	const screenshot = await page.screenshot();

	const { object } = await generateObject({
		model: languageModel,
		schema: Assertion,
		maxRetries: maxRetriesPerAssertion,
		messages: [
			{
				role: 'system',
				content:
					'You are an end user trying to achieve a goal. You are interacting with a website. Determine if the desired outcome has been achieved.',
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `Desired Outcome: ${assertion}`,
					},
					{
						type: 'image',
						image: screenshot,
					},
				],
			},
		],
	});

	const { completed } = object;

	return completed;
};
