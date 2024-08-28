import type { LanguageModel } from './index';
import type { TestOptions } from './types/TestOptions';
import type { PlaywrightTest } from './types/PlaywrightTest';

import _ from 'lodash';
import { _test } from './common/test';

export class PretzelDuck {
	private languageModel: LanguageModel;
	private testOptions: TestOptions;
	private playwrightTest: PlaywrightTest;

	constructor(
		playwrightTest: PlaywrightTest,
		languageModel: LanguageModel,
		testOptions: TestOptions = {
			maxRetriesPerInteraction: 3,
			maxInteractions: 20,
			disabledInteractableElements: [],
			disabledInteractions: [],
			maxRetriesPerAssertion: 2,
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
			_.merge(this.testOptions, testOptions),
		);
}
