import type { LanguageModel } from './index';
import type { PlaywrightTest } from './types/PlaywrightTest';
import type { TestOptions } from './types/TestOptions';

import { merge } from 'lodash';
import { _test } from './common/test';

export class PretzelDuck {
	private languageModel: LanguageModel;
	private testOptions: TestOptions;
	private playwrightTest: PlaywrightTest;

	constructor(
		playwrightTest: PlaywrightTest,
		languageModel: LanguageModel,
		testOptions: TestOptions = {
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
				forcedProgression: true,
				temperature: 0.3,
				entropy: 0.05,
				useScreenshots: true,
				useVisibleHtml: true,
			},
		},
	) {
		this.playwrightTest = playwrightTest;
		this.languageModel = languageModel;
		this.testOptions = testOptions;
	}

	public test = (
		goal: string,
		assertion: string,
		testOptions: Partial<TestOptions> = this.testOptions,
	) =>
		_test(
			this.playwrightTest,
			this.languageModel,
			goal,
			assertion,
			merge(this.testOptions, testOptions),
		);
}
