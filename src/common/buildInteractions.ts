import type { ZodTypeAny } from 'zod';
import { ClickInteraction } from '../schemas/ClickInteraction';
import { InputInteraction } from '../schemas/InputInteraction';
import { ScrollInteraction } from '../schemas/ScrollInteraction';

import type { InteractionSchema } from '../schemas/Interaction';
import type { InteractionLabels } from '../types/InteractionLabels';

export const buildInteractions = (interactionLabels: InteractionLabels[]) => {
	const interactions = interactionLabels.reduce(
		(acc: ZodTypeAny | undefined, interactionLabel) => {
			let interaction: ZodTypeAny;

			switch (interactionLabel) {
				case 'click':
					interaction = ClickInteraction;
					break;
				case 'input':
					interaction = InputInteraction;
					break;
				case 'scroll':
					interaction = ScrollInteraction;
					break;
				default:
					throw new Error(`Unknown interaction label: ${interactionLabel}`);
			}

			if (acc === undefined) {
				return interaction;
			}

			return acc.or(interaction);
		},
		undefined,
	);

	if (interactions === undefined) {
		throw new Error('No interactions found');
	}

	return interactions as InteractionSchema;
};
