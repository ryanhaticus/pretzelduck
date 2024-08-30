import type { Locator } from '@playwright/test';
import type { ModifiedField } from '../types/ModifiableField';

export const progress = async (element: Locator) =>
	element.evaluate((element) => {
		const modifiedField = element.getAttribute(
			'x-pretzelduck-modified-field',
		) as ModifiedField;
		const annotation = element.getAttribute('x-pretzelduck-annotation');

		if (!annotation) {
			return;
		}

		switch (modifiedField) {
			case 'text-content': {
				const { textContent } = element;

				if (textContent == null) {
					return;
				}

				// should replace last instance of annotation with ''
				const lastAnnotationIndex = textContent.lastIndexOf(annotation);
				const newTextContent = textContent.slice(0, lastAnnotationIndex);

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
	});
