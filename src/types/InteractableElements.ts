export const InteractableElements = [
	'button',
	'input',
	'a',
	'textarea',
	'select',
] as const;

export type InteractableElements = (typeof InteractableElements)[number];
