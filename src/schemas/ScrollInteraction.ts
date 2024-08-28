import { z } from 'zod';
import { GenericInteraction } from './GenericInteraction';

export const ScrollInteraction = GenericInteraction.extend({
	type: z.literal('scroll'),
});
