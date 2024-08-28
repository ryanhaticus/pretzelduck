import { z } from 'zod';
import { GenericInteraction } from './GenericInteraction';

export const ElementInteraction = GenericInteraction.extend({
	annotation: z.number(),
});
