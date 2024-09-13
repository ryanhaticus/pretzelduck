import { z } from 'zod';
import { GenericInteraction } from './GenericInteraction';

export const WaitInteraction = GenericInteraction.extend({
	type: z.literal('wait'),
});
