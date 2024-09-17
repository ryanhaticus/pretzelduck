import type { LanguageModel } from 'ai';
import type { PlaywrightTest } from '../types/PlaywrightTest';
import type { TestOptions } from '../types/TestOptions';

import { _annotate } from './annotate';
import { _assert } from './assert';
import { _decide } from './decide';
import { _interact } from './interact';
import { progress } from './progress';
import { setup } from './setup';

export const _test = (
	test: PlaywrightTest,
	languageModel: LanguageModel,
	goal: string,
	assertion: string,
	{ assertions, decisions, interactions }: TestOptions,
) =>
	test(goal, async ({ page }) => {
		await setup(page);

		const { immediate } = assertions;

		if (immediate) {
			const goalAchieved = await _assert(
				languageModel,
				page,
				assertion,
				assertions,
			);

			if (goalAchieved) {
				return;
			}
		}

		let interactionCount = 0;
		let annotationCount = 0;
		let history = '';

		const { interactables, maxInteractions } = interactions;

		do {
			annotationCount += await _annotate(page, interactables, annotationCount);

			const interaction = await _decide(
				languageModel,
				goal,
				history,
				page,
				interactions,
				decisions,
			);

			const { useHistory } = decisions;

			if (useHistory) {
				const { description } = interaction;
				history += `- ${description}\n`;
			}

			const previousPage = page.url();

			const element = await _interact(page, interaction);
			interactionCount++;

			await page.waitForLoadState('domcontentloaded');

			const goalAchieved = await _assert(
				languageModel,
				page,
				assertion,
				assertions,
			);

			if (goalAchieved) {
				return;
			}

			const { progressions } = decisions;
			const { enabled } = progressions;

			const currentPage = page.url();

			if (enabled && previousPage === currentPage && element !== undefined) {
				await Promise.allSettled([progress(element, progressions)]);
			}
		} while (interactionCount < maxInteractions);

		throw new Error(
			`Goal ${goal} not achieved after ${maxInteractions} interactions.`,
		);
	});
