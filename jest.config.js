/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverageThreshold: {
		/*
		I'll write tests eventually, just not now.
		
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
		*/
	},
	setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
	testMatch: ['<rootDir>/test/**/*.test.ts'],
};
