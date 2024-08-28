import { z } from 'zod';
import { ElementInteraction } from './ElementInteraction';

export const InputInteraction = ElementInteraction.extend({
	type: z.literal('input'),
	value: z.string(),
});
