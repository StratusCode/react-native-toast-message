module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'etc'],
	extends: [
		'@react-native-community',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
	],
	rules: {
		semi: ['error', 'never'],
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		'no-console': ['error', { allow: ['warn', 'error'] }],
		'no-alert': 'error',
		'etc/no-t': 'error',
		'etc/prefer-interface': 'error',
	},
	settings: {
		'import/resolver': {
			typescript: {},
		},
		'import/ignore': ['react-native'],
	},
}
