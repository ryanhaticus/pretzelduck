import type { LanguageModel } from './index';
import type { PlaywrightTest } from './types/PlaywrightTest';
import type { RecursivePartial } from './types/RecursivePartial';
import { type TestOptions, DEFAULT_TEST_OPTIONS } from './types/TestOptions';

import { merge } from 'lodash';
import { _test } from './common/test';

export class PretzelDuck {
	private languageModel: LanguageModel;
	private testOptions: TestOptions;
	private playwrightTest: PlaywrightTest;

	constructor(
		playwrightTest: PlaywrightTest,
		languageModel: LanguageModel,
		testOptions: RecursivePartial<TestOptions>,
	) {
		this.playwrightTest = playwrightTest;
		this.languageModel = languageModel;
		this.testOptions = merge(DEFAULT_TEST_OPTIONS, testOptions) as TestOptions;
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

	public it = this.test;
}
