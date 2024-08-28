import { z } from 'zod';
import { ElementInteraction } from './ElementInteraction';

export const ClickInteraction = ElementInteraction.extend({
	type: z.literal('click'),
});
