import { z } from 'zod';
import { ClickInteraction } from './ClickInteraction';
import { EnterInteraction } from './EnterInteraction';
import { InputInteraction } from './InputInteraction';
import { ScrollInteraction } from './ScrollInteraction';

export const Interaction = z.union([
	ClickInteraction,
	InputInteraction,
	ScrollInteraction,
	EnterInteraction,
]);

export type InteractionSchema = typeof Interaction;

export type Interaction = z.infer<typeof Interaction>;
