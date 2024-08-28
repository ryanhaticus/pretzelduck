import type { Page } from '@playwright/test';
import type { InteractionLabels } from '../types/InteractionLabels';

import { type LanguageModel, generateObject } from 'ai';
import { buildInteractions } from './buildInteractions';

export const _decide = async (
	languageModel: LanguageModel,
	goal: string,
	page: Page,
	interactionLabels: InteractionLabels[],
	maxRetriesPerInteraction: number,
) => {
	const interactions = buildInteractions(interactionLabels);

	const screenshot = await page.screenshot();

	const { object } = await generateObject({
		model: languageModel,
		schema: interactions,
		maxRetries: maxRetriesPerInteraction,
		messages: [
			{
				role: 'system',
				content:
					"You are an end user trying to achieve a goal. You are interacting with a website. The screen's interactable elements are labeled with (numbers) and consists of buttons, text fields, and links. Scroll or determine what (number) to click or input text into next to achieve the desired outcome.",
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `Goal: ${goal}`,
					},
					{
						type: 'image',
						image: screenshot,
					},
				],
			},
		],
	});

	const { interaction } = object;
	return interaction;
};
