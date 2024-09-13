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
	page: Page,
	{ disabled }: TestOptions['interactions'],
	{
		temperature,
		maxEntropy,
		maxRetries,
		useScreenshots,
		useVisibleHtml,
	}: TestOptions['decisions'],
) => {
	const interactions = buildInteractionSchemaFromLabels(
		difference(INTERACTION_LABELS, disabled),
	);

	let userContent: UserContent = [
		{
			type: 'text',
			text: `Goal: ${goal}`,
		},
	];

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
				text: visibleHtml,
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
				content: `You are an end user trying to achieve a goal. You are interacting with a website. The page's interactable elements are labeled with annotations (PD:annotation-number) and consists of buttons, text fields, and links. Please determine what annotation-number to interact with and how next to achieve the desired outcome. If you aren't sure what to interact with next, you may need to scroll. If something is loading, you may need to wait.
				\nValid interaction types (how to interact) are: ${INTERACTION_LABELS.join(', ')}`,
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
