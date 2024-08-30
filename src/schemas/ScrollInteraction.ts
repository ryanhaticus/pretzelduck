import { z } from 'zod';
import { GenericInteraction } from './GenericInteraction';

export const ScrollInteraction = GenericInteraction.extend({
	type: z.literal('scroll'),
	direction: z.enum(['up', 'down', 'right', 'left']),
	numberOfPixels: z.number().min(0),
});
