import type { LanguageModel } from 'ai';
import type { PlaywrightTest } from '../types/PlaywrightTest';
import type { TestOptions } from '../types/TestOptions';

import { _annotate } from './annotate';
import { _assert } from './assert';
import { _decide } from './decide';
import { _interact } from './interact';
import { progress } from './progress';

export const _test = (
	test: PlaywrightTest,
	languageModel: LanguageModel,
	goal: string,
	assertion: string,
	{ assertions, decisions, interactions }: TestOptions,
) =>
	test(goal, async ({ page }) => {
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

			const element = await _interact(page, interaction);
			interactionCount++;

			const { forcedProgression } = decisions;

			if (forcedProgression && element !== undefined) {
				await progress(element);
			}

			const goalAchieved = await _assert(
				languageModel,
				page,
				assertion,
				assertions,
			);

			if (goalAchieved) {
				return;
			}
		} while (interactionCount < maxInteractions);

		throw new Error(
			`Goal ${goal} not achieved after ${maxInteractions} interactions.`,
		);
	});
