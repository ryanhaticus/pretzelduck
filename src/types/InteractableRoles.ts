export const INTERACTABLE_ROLES = [
	'scrollbar',
	'searchbox',
	'slider',
	'switch',
	'tab',
	'spinbutton',
	'combobox',
	'button',
	'checkbox',
	'input',
	'link',
	'menuitem',
	'menuitemcheckbox',
	'menuitemradio',
	'option',
	'select',
	'textbox',
] as const;

export type InteractableRoles = (typeof INTERACTABLE_ROLES)[number];
