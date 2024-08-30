import type { Page } from '@playwright/test';
import type { TestOptions } from '../types/TestOptions';
import type { ModifiedField } from '../types/ModifiableField';

import { difference } from 'lodash';
import { INTERACTABLE_ELEMENTS } from '../types/InteractableElements';
import { INTERACTABLE_ROLES } from '../types/InteractableRoles';

export const _annotate = (
	page: Page,
	{
		disabledElements,
		disabledRoles,
	}: TestOptions['interactions']['interactables'],
	annotationCount: number,
) => {
	const elementsSelectors = difference(
		INTERACTABLE_ELEMENTS,
		disabledElements,
	).join(', ');

	const rolesSelectors = difference(INTERACTABLE_ROLES, disabledRoles)
		.map((role) => `[role="${role}"]`)
		.join(', ');

	return page.evaluate(
		({ elementsSelectors, rolesSelectors, annotationCount }) => {
			const elements = document.querySelectorAll(
				[elementsSelectors, rolesSelectors].join(', '),
			);

			let localAnnotationCount = annotationCount;

			for (const element of elements) {
				const previouslyAnnotated = element.hasAttribute('x-pretzelduck');
				if (previouslyAnnotated) {
					continue;
				}

				if (!window.isElementVisible(element)) {
					continue;
				}

				element.setAttribute('x-pretzelduck', 'true');

				const descriptor =
					element.getAttribute('role') ??
					element.getAttribute('type') ??
					element.tagName;

				element.setAttribute('x-pretzelduck-descriptor', descriptor);

				const annotation = `(PD:${localAnnotationCount})`;
				element.setAttribute('x-pretzelduck-annotation', annotation);

				if (element.hasAttribute('placeholder')) {
					const placeholder = element.getAttribute('placeholder');

					element.setAttribute('placeholder', `${placeholder} ${annotation}`);
					element.setAttribute(
						'x-pretzelduck-modified-field',
						'placeholder' satisfies ModifiedField,
					);
				} else if (element.hasAttribute('value')) {
					const value = element.getAttribute('value');

					element.setAttribute('value', `${value} ${annotation}`);
					element.setAttribute(
						'x-pretzelduck-modified-field',
						'value' satisfies ModifiedField,
					);
				} else {
					const { textContent } = element;

					element.textContent = `${textContent} ${annotation}`;
					element.setAttribute(
						'x-pretzelduck-modified-field',
						'text-content' satisfies ModifiedField,
					);
				}

				localAnnotationCount++;
			}

			return localAnnotationCount;
		},
		{
			elementsSelectors,
			rolesSelectors,
			annotationCount,
		},
	);
};
