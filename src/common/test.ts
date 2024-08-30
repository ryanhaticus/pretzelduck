import type { LanguageModel } from 'ai';
import type { PlaywrightTest } from '../types/PlaywrightTest';
import type { TestOptions } from '../types/TestOptions';

import { _annotate } from './annotate';
import { _assert } from './assert';
import { _decide } from './decide';
import { _interact } from './interact';
import { progress } from './progress';
import { ignoreRejection } from './utils/ignoreRejection';
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

		let interactionCount = 0;
		let annotationCount = 0;

		const { interactables, maxInteractions } = interactions;

		do {
			annotationCount += await _annotate(page, interactables, annotationCount);

			const interaction = await _decide(
				languageModel,
				goal,
				page,
				interactions,
				decisions,
			);

			const previousPage = page.url();

			const element = await _interact(page, interaction);
			interactionCount++;

			const goalAchieved = await _assert(
				languageModel,
				page,
				assertion,
				assertions,
			);

			if (goalAchieved) {
				return;
			}

			const { forcedProgression } = decisions;

			const currentPage = page.url();

			if (
				forcedProgression &&
				previousPage === currentPage &&
				element !== undefined
			) {
				await ignoreRejection(progress(element));
			}
		} while (interactionCount < maxInteractions);

		throw new Error(
			`Goal ${goal} not achieved after ${maxInteractions} interactions.`,
		);
	});
