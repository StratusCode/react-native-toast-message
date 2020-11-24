module.exports = {
	root: true,
	extends: [
		'@react-native-community',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	globals: {
		__DEV__: false,
		fetch: false,
	},
	rules: {
		semi: [2, 'never'],
		'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
	},
	settings: {
		'import/resolver': {
			typescript: {},
		},
		'import/ignore': ['react-native'],
	},
}
