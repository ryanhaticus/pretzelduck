import type { InteractableElements } from './InteractableElements';
import type { InteractableRoles } from './InteractableRoles';
import type { InteractionLabels } from './InteractionLabels';

export type TestOptions = {
	interactions: {
		maxInteractions: number;
		disabled: InteractionLabels[];
		interactables: {
			disabledElements: InteractableElements[];
			disabledRoles: InteractableRoles[];
		};
	};
	assertions: {
		maxRetries: number;
		temperature: number;
	};
	decisions: {
		maxRetries: number;
		forcedProgression: boolean;
		temperature: number;
		maxEntropy: number;
		useScreenshots: boolean;
		useVisibleHtml: boolean;
	};
};
