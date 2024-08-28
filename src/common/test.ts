import type { LanguageModel } from 'ai';
import type { Interaction } from '../schemas/Interaction';
import type { PlaywrightTest } from '../types/PlaywrightTest';
import type { TestOptions } from '../types/TestOptions';

import _ from 'lodash';
import { InteractableElements } from '../types/InteractableElements';
import { InteractionLabels } from '../types/InteractionLabels';
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
	{
		disabledInteractions,
		disabledInteractableElements,
		maxInteractions,
		maxRetriesPerInteraction,
		maxRetriesPerAssertion,
		forcedProgression,
	}: TestOptions,
) =>
	test(goal, async ({ page }) => {
		const interactionLabels = _.difference(
			InteractionLabels,
			disabledInteractions,
		);

		const interactableElementsSelector = _.difference(
			InteractableElements,
			disabledInteractableElements,
		).join(', ');

		let interactionCount = 0;

		do {
			await _annotate(page, interactableElementsSelector);

			const interaction = await _decide(
				languageModel,
				goal,
				page,
				interactionLabels,
				maxRetriesPerInteraction,
			);

			const element = await _interact(page, interaction);
			interactionCount++;

			if (forcedProgression && element !== undefined) {
				await progress(element);
			}

			const goalAchieved = await _assert(
				languageModel,
				page,
				assertion,
				maxRetriesPerAssertion,
			);

			if (goalAchieved) {
				return;
			}
		} while (interactionCount < maxInteractions);

		throw new Error(
			`Goal ${goal} not achieved after ${maxInteractions} interactions.`,
		);
	});
