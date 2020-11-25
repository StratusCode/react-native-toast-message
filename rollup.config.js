import autoExternal from 'rollup-plugin-auto-external'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'

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
		autoExternal(),
		resolve(),
		commonjs({
			include: /node_modules/,
		}),
		babel({
			exclude: /node_modules/,
		}),
		json(),
		replace({
			__version__: pkg.version,
		}),
	],
}
