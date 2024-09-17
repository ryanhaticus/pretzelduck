import { z } from 'zod';
import { GenericInteraction } from './GenericInteraction';

export const SubmitInteraction = GenericInteraction.extend({
	type: z.literal('submit'),
});
