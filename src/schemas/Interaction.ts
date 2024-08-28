import { z } from 'zod';
import { ClickInteraction } from './ClickInteraction';
import { InputInteraction } from './InputInteraction';

export const Interaction = z.union([ClickInteraction, InputInteraction]);

export type InteractionSchema = typeof Interaction;

export type Interaction = z.infer<typeof Interaction>;
