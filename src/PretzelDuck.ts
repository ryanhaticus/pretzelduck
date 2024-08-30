import type { LanguageModel } from './index';
import type { PlaywrightTest } from './types/PlaywrightTest';
import type { TestOptions } from './types/TestOptions';
import type { RecursivePartial } from './types/RecursivePartial';

import { merge } from 'lodash';
import { _test } from './common/test';

export class PretzelDuck {
	private languageModel: LanguageModel;
	private testOptions: TestOptions;
	private playwrightTest: PlaywrightTest;

	constructor(
		playwrightTest: PlaywrightTest,
		languageModel: LanguageModel,
		testOptions: RecursivePartial<TestOptions> = {
			interactions: {
				maxInteractions: 20,
				disabled: [],
				interactables: {
					disabledElements: [],
					disabledRoles: [],
				},
			},
			assertions: {
				maxRetries: 2,
				temperature: 0.1,
			},
			decisions: {
				maxRetries: 3,
				progressions: {
					enabled: true,
					type: 'forced',
					timeout: 5000,
				},
				temperature: 0.3,
				maxEntropy: 0.05,
				useScreenshots: true,
				useVisibleHtml: true,
			},
		} satisfies TestOptions,
	) {
		this.playwrightTest = playwrightTest;
		this.languageModel = languageModel;
		this.testOptions = testOptions as TestOptions;
	}

	public test = (
		goal: string,
		assertion: string,
		testOptions: RecursivePartial<TestOptions> = this.testOptions,
	) =>
		_test(
			this.playwrightTest,
			this.languageModel,
			goal,
			assertion,
			merge(this.testOptions, testOptions),
		);
}
