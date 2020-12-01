import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import externals from 'rollup-plugin-node-externals'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default {
	input: 'src/index.ts',
	external: [],
	output: [
		{
			dir: 'dist',
			format: 'es',
			sourcemap: true,
		},
	],
	preserveModules: true,
	plugins: [
		externals(),
		resolve(),
		commonjs({
			include: /node_modules/,
		}),
		typescript(),
		json(),
		replace({
			__version__: pkg.version,
		}),
	],
}
