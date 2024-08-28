import type { LanguageModel } from 'ai';
import type { TestOptions } from '../types/TestOptions';

import { test } from '@playwright/test';

import _ from 'lodash';
import { InteractableElements } from '../types/InteractableElements';
import { InteractionLabels } from '../types/InteractionLabels';
import { _annotate } from './annotate';
import { _assert } from './assert';
import { _decide } from './decide';
import { _interact } from './interact';

export const _test = (
	languageModel: LanguageModel,
	goal: string,
	assertion: string,
	{
		disabledInteractions,
		disabledInteractableElements,
		maxInteractions,
		maxRetriesPerInteraction,
		maxRetriesPerAssertion,
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
			const interactableElements = await page.$$(interactableElementsSelector);

			await _annotate(interactableElements);

			const interaction = await _decide(
				languageModel,
				goal,
				page,
				interactionLabels,
				maxRetriesPerInteraction,
			);

			await _interact(page, interaction);
			interactionCount++;

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
