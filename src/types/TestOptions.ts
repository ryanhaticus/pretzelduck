import type { InteractableElements } from './InteractableElements';
import type { InteractionLabels } from './InteractionLabels';

export type TestOptions = {
	maxRetriesPerInteraction: number;
	maxInteractions: number;
	disabledInteractableElements: InteractableElements[];
	disabledInteractions: InteractionLabels[];
	maxRetriesPerAssertion: number;
};
