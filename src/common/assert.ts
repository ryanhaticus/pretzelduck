import type { Page } from '@playwright/test';
import { type LanguageModel, generateObject } from 'ai';
import type { TestOptions } from '../types/TestOptions';

import { Assertion } from '../schemas/Assertion';
import { fastScreenshot } from './utils/fastScreenshot';

export const _assert = async (
	languageModel: LanguageModel,
	page: Page,
	assertion: string,
	{ maxRetries, temperature }: TestOptions['assertions'],
) => {
	const screenshot = await fastScreenshot(page);

	const { object } = await generateObject({
		model: languageModel,
		schema: Assertion,
		maxRetries,
		temperature,
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
