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
		progressions: {
			enabled: boolean;
			type: 'forced';
			timeout: number;
		};
		temperature: number;
		maxEntropy: number;
		useScreenshots: boolean;
		useVisibleHtml: boolean;
	};
};

export const DEFAULT_TEST_OPTIONS: TestOptions = {
	interactions: {
		maxInteractions: 20,
		disabled: [],
		interactables: {
			disabledElements: [],
			disabledRoles: [],
		},
	},
	assertions: {
		maxRetries: 2,
		temperature: 0.1,
	},
	decisions: {
		maxRetries: 3,
		progressions: {
			enabled: true,
			type: 'forced',
			timeout: 5000,
		},
		temperature: 0.3,
		maxEntropy: 0.05,
		useScreenshots: true,
		useVisibleHtml: true,
	},
} as const;
