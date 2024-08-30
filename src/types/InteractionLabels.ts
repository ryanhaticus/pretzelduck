export const INTERACTION_LABELS = [
	'click',
	'input',
	'scroll',
	'enter',
] as const;

export type InteractionLabels = (typeof INTERACTION_LABELS)[number];
