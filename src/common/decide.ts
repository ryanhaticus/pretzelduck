import type { Page } from '@playwright/test';
import { type LanguageModel, type UserContent, generateObject } from 'ai';
import type { TestOptions } from '../types/TestOptions';

import { difference } from 'lodash';
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

			const visibleElements = Array.from(elements).filter((element) => {
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
			});

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

	const { object } = await generateObject({
		model: languageModel,
		schema: interactions,
		maxRetries: maxRetries,
		temperature: temperature,
		messages: [
			{
				role: 'system',
				content:
					"You are an end user trying to achieve a goal. You are interacting with a website. The screen's interactable elements are labeled with (numbers) and consists of buttons, text fields, and links. Please determine what (number) to click or input text into next to achieve the desired outcome.",
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
