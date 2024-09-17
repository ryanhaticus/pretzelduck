import type { Page } from '@playwright/test';
import { type LanguageModel, type UserContent, generateObject } from 'ai';
import type { TestOptions } from '../types/TestOptions';

import { clamp, difference } from 'lodash';
import { INTERACTION_LABELS } from '../types/InteractionLabels';
import { buildInteractionSchemaFromLabels } from './utils/buildInteractionSchemaFromLabels';
import { fastScreenshot } from './utils/fastScreenshot';

export const _decide = async (
	languageModel: LanguageModel,
	goal: string,
	history: string,
	page: Page,
	{ disabled }: TestOptions['interactions'],
	{
		temperature,
		maxEntropy,
		maxRetries,
		useScreenshots,
		useVisibleHtml,
		useHistory,
	}: TestOptions['decisions'],
) => {
	const interactions = buildInteractionSchemaFromLabels(
		difference(INTERACTION_LABELS, disabled),
	);

	let userContent: UserContent = [
		{
			type: 'text',
			text: `Goal:
${goal}`,
		},
	];

	if (useHistory && history !== '') {
		userContent = [
			...userContent,
			{
				type: 'text',
				text: `History:
${history}`,
			},
		];
	}

	if (useScreenshots) {
		const screenshot = await fastScreenshot(page);

		userContent = [
			...userContent,
			{
				type: 'image',
				image: screenshot,
			},
		];
	}

	if (useVisibleHtml) {
		const visibleHtml = await page.evaluate(() => {
			const elements = document.querySelectorAll('[x-pretzelduck-annotation]');

			const visibleElements = Array.from(elements).filter(
				window.isElementVisible,
			);

			const html = visibleElements
				.map((element) => {
					const annotation = element.getAttribute('x-pretzelduck-annotation');
					const descriptor = element.getAttribute('x-pretzelduck-descriptor');

					const { outerHTML, innerHTML, textContent } = element;

					const truncatedHtml = outerHTML.replace(innerHTML, textContent ?? '');

					return `${descriptor} ${annotation}: ${truncatedHtml}`;
				})
				.join('\n');

			return html;
		});

		userContent = [
			...userContent,
			{
				type: 'text',
				text: `HTML:
${visibleHtml}`,
			},
		];
	}

	const temperatureWithEntropy = clamp(
		(Math.round(
			(temperature + Math.random() * maxEntropy + Number.EPSILON) * 100,
		) /
			100) *
			(Math.random() > 0.5 ? 1 : -1),
		0,
		1,
	);

	const { object } = await generateObject({
		model: languageModel,
		schema: interactions,
		maxRetries: maxRetries,
		temperature: temperatureWithEntropy,
		messages: [
			{
				role: 'system',
				content: `Who:
You are an end-user trying to achieve a goal by interacting with a website.
				
What:
Interactable elements are labeled with (PD:1), (PD:2), etc., always in a (PD:#) format.

Task:
You must choose a labeled element # and user interaction on that element to get closer to achieving the goal. You should also provide a short 1 sentence description of the action you're performing so you can recall it later.

Valid Interaction Types:
${INTERACTION_LABELS.join(', ')}

Rules and Caveats:
If you aren't sure what to interact with next or are uncertain, you may need to scroll to see more elements. If the page's content is still loading OR content is clearly missing that would prevent you from achieving the goal, you MUST wait.`,
			},
			{
				role: 'user',
				content: userContent,
			},
		],
	});

	const { interaction } = object;

	return interaction;
};
