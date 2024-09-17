import { z } from 'zod';
import { INTERACTION_LABELS } from '../types/InteractionLabels';

export const GenericInteraction = z.object({
	type: z.enum(INTERACTION_LABELS),
	description: z.string(),
});
