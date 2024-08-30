export const INTERACTABLE_ELEMENTS = [
	'button',
	'input',
	'a',
	'textarea',
	'select',
] as const;

export type InteractableElements = (typeof INTERACTABLE_ELEMENTS)[number];
