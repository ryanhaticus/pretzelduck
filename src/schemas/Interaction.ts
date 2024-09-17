import { z } from 'zod';
import { ClickInteraction } from './ClickInteraction';
import { InputInteraction } from './InputInteraction';
import { ScrollInteraction } from './ScrollInteraction';
import { SubmitInteraction } from './SubmitInteraction';
import { WaitInteraction } from './WaitInteraction';

export const Interaction = z.union([
	ClickInteraction,
	InputInteraction,
	ScrollInteraction,
	SubmitInteraction,
	WaitInteraction,
]);

export type InteractionSchema = typeof Interaction;

export type Interaction = z.infer<typeof Interaction>;
