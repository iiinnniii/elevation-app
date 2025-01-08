import globals from 'globals';
import js from '@eslint/js';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginStylisticJs from '@stylistic/eslint-plugin-js';
import pluginJsonc from 'eslint-plugin-jsonc';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginCypress from 'eslint-plugin-cypress/flat';
import pluginChaiFriendly from 'eslint-plugin-chai-friendly';
import pluginMocha from 'eslint-plugin-mocha';
import pluginVitest from 'eslint-plugin-vitest';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'dist',
			'node_modules',
			'package-lock.json',
			'.pnpm-store',
			'pnpm-lock.yaml',
			'src/types/generated/schema.d.ts',
			'Dockerfile',
			'.dockerignore',
			'.gitattributes',
			'.gitignore',
			'.prettierignore',
			'.gitlab-ci.yml',
			'README.md',
			'index.html',
			'**/*.svg',
			'**/*.css',
			'cache',
			'cypress/fixtures',
			'cypress/support',
			'nginx.conf',
		],
	},
	// Common config for all JavaScript and TypeScript files
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		extends: [pluginPrettierRecommended, js.configs.recommended],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.es2020,
			},
		},
		plugins: {
			unicorn: pluginUnicorn,
			'@stylistic/js': pluginStylisticJs,
		},
		rules: {
			'@stylistic/js/comma-dangle': [
				'warn',
				{
					arrays: 'always-multiline',
					objects: 'always-multiline',
					imports: 'always-multiline',
					exports: 'always-multiline',
					functions: 'only-multiline',
					importAttributes: 'always',
					dynamicImports: 'always',
				},
			],
			'@stylistic/js/no-extra-semi': 'warn',
			'@stylistic/js/quotes': ['warn', 'single'],
			'@stylistic/js/semi': ['warn', 'always'],
			'unicorn/switch-case-braces': 'warn',
			'no-unused-vars': [
				'warn',
				{
					args: 'none',
				},
			],
		},
	},
	// Common config for all TypeScript files
	{
		files: ['**/*.{ts,tsx}'],
		extends: [tseslint.configs.recommended],
		plugins: {
			'@stylistic/js': pluginStylisticJs,
		},
		rules: {
			'no-undef': 'error', // The TypeScript compiler does catch all those errors anyway, but I also want red squiggles in Visual Studio Code.
			'@typescript-eslint/consistent-type-imports': 'warn',
			'@typescript-eslint/no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'react-redux',
							importNames: ['useSelector', 'useStore', 'useDispatch'],
							message:
								'Please use pre-typed versions from `src/app/hooks.ts` instead.',
						},
					],
				},
			],
		},
	},
	// React specific
	{
		files: ['**/*.{jsx,tsx}'],
		extends: [
			pluginReact.configs.flat.recommended,
			pluginReact.configs.flat['jsx-runtime'],
			pluginReactRefresh.configs.vite,
		],
		settings: {
			react: {
				version: 'detect', // React version. "detect" automatically picks the version you have installed.
				// You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
				// Defaults to the "defaultVersion" setting and warns if missing, and to "detect" in the future
			},
		},
		plugins: {
			react: pluginReact,
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.serviceworker,
				...globals.browser,
			},
		},
	},
	// Config for all other JavaScript and TypeScript files which are not frontend related
	{
		// Matches all JavaScript and TypeScript files which are not frontend related
		// NO MATCH src/App.tsx
		// MATCH    src/App.test.tsx
		// MATCH    vite.config.ts
		// MATCH    scripts/something.js
		// MATCH    e2e/selenium/test/main.test.ts
		files: ['!src/**/!(*.test).[tj]s?(x)'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	// Config for jest unit/integration test files
	// Note: jest types conflict with cypress using mocha (describe conflict) use vitest or mocha instead.
	// {
	// 	files: ['**/?(*.)@(spec|test).[tj]s?(x)'],
	// 	extends: [pluginJest.configs['flat/recommended']],
	// 	plugins: { jest: pluginJest },
	// 	languageOptions: {
	// 		globals: {
	// 			...globals.node,
	// 			...globals.jest,
	// 			...pluginJest.environments.globals.globals,
	// 		},
	// 	},
	// },
	// Config for vitest unit/integration test files
	{
		files: ['**/?(*.)@(spec|test).[tj]s?(x)'],
		extends: [pluginVitest.configs.recommended],
		plugins: { vitest: pluginVitest },
		languageOptions: {
			globals: {
				...globals.node,
				...pluginVitest.environments.env.globals,
			},
		},
	},
	// Config for cypress test files
	{
		files: ['**/?(*.)+(cy).[tj]s?(x)'],
		extends: [
			pluginCypress.configs.recommended,
			pluginCypress.configs.globals,
			pluginChaiFriendly.configs.recommendedFlat,
			pluginMocha.configs.flat.recommended,
		],
		plugins: {
			cypress: pluginCypress,
			'chai-friendly': pluginChaiFriendly,
		},
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	// Config for .json files
	{
		files: ['**/*.json'],
		extends: [
			pluginJsonc.configs['flat/base'],
			pluginJsonc.configs['flat/recommended-with-json'],
			// Note: I do not use prettier to format json files, because there is bug at which files within .vscode are not
			// formatted, as well as the mandatory new line at the end of the file is annoying, but acceptable
		],
		rules: {
			'jsonc/indent': ['warn', 'tab', {}],
		},
	},
	// Allow exceptions for files that ideally should not have the .json extension, as .json typically disallows comments.
	// However, from both VSCode and the perspective of the code utilizing these files, comments are indeed permissible.
	{
		files: [
			'tsconfig.json',
			'tsconfig.app.json',
			'tsconfig.node.json',
			'.vscode/extensions.json',
			'.vscode/launch.json',
			'.vscode/tasks.json',
			'.vscode/settings.json',
			'.devcontainer/devcontainer.json',
		],
		extends: [
			pluginJsonc.configs['flat/base'],
			pluginJsonc.configs['flat/recommended-with-jsonc'],
		],
		rules: {
			'jsonc/no-comments': 'off',
		},
	},
);
