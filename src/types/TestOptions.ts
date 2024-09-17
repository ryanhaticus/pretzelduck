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
		immediate: boolean;
		useHistory: boolean;
	};
	decisions: {
		maxRetries: number;
		progressions: {
			enabled: boolean;
			type: 'forced';
		};
		temperature: number;
		maxEntropy: number;
		useScreenshots: boolean;
		useVisibleHtml: boolean;
		useHistory: boolean;
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
		immediate: false,
		useHistory: true,
	},
	decisions: {
		maxRetries: 3,
		progressions: {
			enabled: true,
			type: 'forced',
		},
		temperature: 0.3,
		maxEntropy: 0.05,
		useScreenshots: true,
		useVisibleHtml: true,
		useHistory: true,
	},
} as const;
