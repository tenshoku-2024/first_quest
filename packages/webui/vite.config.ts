
import {
	fileURLToPath,
	URL,
} from 'node:url';

import {defineConfig} from 'vite';
import wasm from 'vite-plugin-wasm';
import vue from '@vitejs/plugin-vue';
import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
	optimizeDeps:{
		esbuildOptions:{
			define:{
				global:'window',
			},
			plugins:[
				NodeGlobalsPolyfillPlugin(
					{
						buffer:true,
					},
				),
			],
		},
	},
	plugins:[
		wasm(),
		vue(),
	],
	resolve:{
		alias:{
			'symbol-crypto-wasm-node':fileURLToPath(new URL('../../node_modules/symbol-crypto-wasm-web/symbol_crypto_wasm.js',import.meta.url)),
			'@':fileURLToPath(new URL('./src',import.meta.url)),
		},
	},
	build:{
		target:[
			'es2022',
		],
	},
	server:{
		watch:{
			usePolling:true,
		},
	},
});
