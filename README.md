# Pretzel Duck
Use natural language to write end-to-end tests in Playwright.

> :warning:  The Pretzel Duck project is in it's early stages. Please expect frequent changes and improvements.

```typescript
import { PretzelDuck, openai } from "pretzelduck";
import { test } from "@playwright/test";

const { describe, beforeEach } = test;

const { it } = new PretzelDuck(test, openai("gpt-4o"));

describe("search functionality", () => {
	beforeEach(async ({ page }) => {
		await page.goto("https://github.com/");
	});

	it(
		"should find and favorite the Pretzel Duck repository",
		"the favorite button should be highlighted yellow on a GitHub repository titled Pretzel Duck",
	);
});
```

## Why
End-to-end (E2E) testing in its current form is often not practical for various reasons:
- Writing end-to-end tests takes a long time.
- Often, in order to use end-to-end tests effectively, you need to maintain a mock API or have control over your environment's data.
- Seemingly small UI changes can break end-to-end tests, requiring you spend additional time fixing them.

From the author:
> As an engineer at John Deere, my team tirelessly works to meet feature deadlines and deliver bug fixes. Moreover, we don't control the data in our quality assurance environment. Though we wanted to save integration testing time, the investment required to write end-to-end tests has never proven to be worth it. The Pretzel Duck project was a shower thought of mine to help my team overcome this opportunity cost. Though it can be quite expensive to run an LLM, especially in this fashion, the engineering time outweighs this cost ten-fold.

## Features

- Simple to use with good defaults
    - Just provide a natural language `goal` and `assertion` for every test
- Interactions such as clicking, inputting text, scrolling, and hitting enter
- Highly configurable with a BYOM (bring your own model) approach
- Use existing Playwright DX features like tracing and UI
- **Saves engineering time**

## Getting Started
- [I don't have an existing Playwright test suite](#i-dont-have-an-existing-playwright-test-suite)
- [I have an existing Playwright test suite](#i-have-an-existing-playwright-test-suite)

### I don't have an existing Playwright test suite
Before proceeding, please follow the [introductory Playwright documentation](https://playwright.dev/docs/intro) to create your first test suite. This usually takes around 5-10 minutes.

Next, modify your `playwright.config.ts` to increase the test timeout time.
Because Pretzel Duck repeatedly makes calls to your model of choice, testing times can become lengthy. As you refine your goal prompts, you may be able to decrease the testing suite timeout. We recommend a minute to start.
```typescript
export default defineConfig({
    // ...
    timeout: 60000
    // ...
});
```

### I have an existing Playwright test suite
You'll first need to install Pretzel Duck via [npm](https://www.npmjs.com/).
```bash
npm i pretzelduck
```

Next, create a `pretzelduck.ts` file that's accessible from your testing suite.
```typescript
import { PretzelDuck, openai } from 'pretzelduck';
import { test } from '@playwright/test';

/*
    The `model` expected by Pretzel Duck is identical to those created by the Vercel AI SDK.
    We support any model that allows for multi-modal input (image and text).
    
    This example uses `openai`, but others are available.
    You will need to provide an API key using the respective environment variables.
*/
const model = openai('gpt-4o');

export const pretzelDuck = new PretzelDuck(test, model);
```

In your testing suite, you're now ready to write your first natural language end-to-end test!
Open up an existing `.spec.ts` or `.test.ts` file, or use the one `example.spec.ts` generated by Playwright.
```typescript
import { test } from "@playwright/test";
import { pretzelDuck } from "./pretzelduck";

// Setup the page using the base Playwright `test` utility.
test.beforeEach(async ({ page }) => {
	await page.goto("https://www.example.com/");
});

pretzelDuck.test(
	"find more information about protocol registries", // goal
	"you should be on a page titled Protocol Registries", // assertion indicating the goal has been reached
);
```

That's it, test away! In your console, enter the following:
```bash
npx playwright test --ui
```

From the UI, run the respective test and see the model perform in real-time.

## Advanced
Though Pretzel Duck strives to be a 0-configuration solution, more advanced use cases may require some fine-tuning. Fortunately, you can configure Pretzel Duck instance-by-instance and test-by-test.

The following options can be provided as a trailing parameter on both the `PretzelDuck` class and the `test` function:
```typescript
type TestOptions = {
	interactions: {
		maxInteractions: number;
		disabled: InteractionLabels[];
		interactables: {
			disabledElements: InteractableElements[];
			disabledRoles: InteractableRoles[];
		};
	};
	assertions: {
		maxRetries: number;
		temperature: number;
	};
	decisions: {
		maxRetries: number;
		progressions: {
			enabled: boolean;
			type: 'forced';
			timeout: number;
		};
		temperature: number;
		maxEntropy: number;
		useScreenshots: boolean;
		useVisibleHtml: boolean;
	};
};
```
Here's an example of the configuration in use:
```typescript
import { PretzelDuck } from "pretzelduck";
import { test } from "@playwright/test";

export const pretzelDuck = new PretzelDuck(test, /* Your Model Here */, {
	interactions: {
		disabled: ["enter"],
		interactables: {
			disabledElements: ["select"],
			disabledRoles: ["menuitem"],
		},
	},
	decisions: {
		temperature: 0.8,
	},
});

pretzelDuck.test(
	"find the e-mail address of the website owner",
	"an e-mail address should be visible on screen",
	{
		decisions: {
			progressions: {
				enabled: false,
			},
			useVisibleHtml: false,
		},
	},
);
```

## Architecture
![image](https://github.com/user-attachments/assets/cd056925-29c8-4fff-bad3-3af6bc66da5e)

