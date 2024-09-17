export const INTERACTION_LABELS = [
	'click',
	'input',
	'scroll',
	'submit',
	'wait',
] as const;

export type InteractionLabels = (typeof INTERACTION_LABELS)[number];
