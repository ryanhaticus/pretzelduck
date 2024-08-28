import type { ElementHandle } from '@playwright/test';

export const _annotate = (
	elements: ElementHandle<SVGElement | HTMLElement>[],
) =>
	Promise.all(
		elements.map((element, index) =>
			element.evaluate((node, ind) => {
				node.textContent = `${node.textContent}(${ind})`;
			}, index),
		),
	);
