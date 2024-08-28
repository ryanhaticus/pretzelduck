import { z } from 'zod';
import { InteractionLabels } from '../types/InteractionLabels';

export const GenericInteraction = z.object({
	type: z.enum(InteractionLabels),
});
