import { z } from 'zod';
import { ClickInteraction } from './ClickInteraction';
import { InputInteraction } from './InputInteraction';
import { ScrollInteraction } from './ScrollInteraction';
import { EnterInteraction } from './EnterInteraction';

export const Interaction = z.union([
	ClickInteraction,
	InputInteraction,
	ScrollInteraction,
	EnterInteraction,
]);

export type InteractionSchema = typeof Interaction;

export type Interaction = z.infer<typeof Interaction>;
