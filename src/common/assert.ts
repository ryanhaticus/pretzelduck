import type { Page } from '@playwright/test';
import { type LanguageModel, type UserContent, generateObject } from 'ai';
import type { TestOptions } from '../types/TestOptions';

import { Assertion } from '../schemas/Assertion';
import { fastScreenshot } from './utils/fastScreenshot';

export const _assert = async (
	languageModel: LanguageModel,
	page: Page,
	assertion: string,
	{ maxRetries, temperature, useHistory }: TestOptions['assertions'],
	history?: string,
) => {
	const screenshot = await fastScreenshot(page);

	let userContent: UserContent = [
		{
			type: 'text',
			text: `Desired Outcome:
${assertion}`,
		},
	];

	if (useHistory && history !== undefined) {
		userContent = [
			...userContent,
			{
				type: 'text',
				text: `Previously Performed Interactions:
	${history}`,
			},
		];
	}

	const { object } = await generateObject({
		model: languageModel,
		schema: Assertion,
		maxRetries,
		temperature,
		messages: [
			{
				role: 'system',
				content: `Who:
You are an end-user trying to achieve a goal by interacting with a website.

Task: Determine if the goal has been achieved.`,
			},
			{
				role: 'user',
				content: [
					...userContent,
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
