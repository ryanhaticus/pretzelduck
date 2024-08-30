import type { Locator } from '@playwright/test';
import type { ModifiedField } from '../types/ModifiableField';
import type { TestOptions } from '../types/TestOptions';

import { replaceLast } from './utils/replaceLast';

export const progress = async (
	element: Locator,
	{ timeout }: TestOptions['decisions']['progressions'],
) =>
	element.evaluate(
		(element) => {
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
		},
		undefined,
		{
			timeout,
		},
	);
