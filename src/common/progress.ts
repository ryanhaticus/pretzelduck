import type { Page } from '@playwright/test';
import type { ModifiedField } from '../types/ModifiableField';

import { replaceLast } from './utils/replaceLast';

export const progress = async (page: Page, selector: string) =>
	page.evaluate((selector) => {
		const element = document.querySelector(selector);

		if (element == null) {
			return;
		}

		const annotation = element.getAttribute('x-pretzelduck-annotation');

		if (annotation == null) {
			return;
		}

		element.removeAttribute('x-pretzelduck-annotation');

		const modifiedField = element.getAttribute(
			'x-pretzelduck-modified-field',
		) as ModifiedField;

		switch (modifiedField) {
			case 'text-content': {
				const { textContent } = element;

				if (textContent == null) {
					return;
				}

				const newTextContent = replaceLast(textContent, annotation, '');

				element.textContent = newTextContent;

				break;
			}
			case 'placeholder':
			case 'value': {
				const attribute = modifiedField;

				const attributeValue = element.getAttribute(attribute);

				if (attributeValue == null) {
					return;
				}

				const lastAnnotationIndex = attributeValue.lastIndexOf(annotation);
				const newValue = attributeValue.slice(0, lastAnnotationIndex);

				element.setAttribute(attribute, newValue);

				break;
			}
		}
	}, selector);
