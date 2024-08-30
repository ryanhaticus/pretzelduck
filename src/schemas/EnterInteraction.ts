import { z } from 'zod';
import { GenericInteraction } from './GenericInteraction';

export const EnterInteraction = GenericInteraction.extend({
	type: z.literal('enter'),
});
