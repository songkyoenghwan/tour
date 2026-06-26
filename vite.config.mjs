import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { aliases } from './aliases.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	root: '.',
	resolve: { alias: aliases },
	define: {
		'process.env.NODE_ENV': JSON.stringify('production'),
	},
	plugins: [
		enhancedImages(),
		tailwindcss(),
		svelte(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/paraglide',
			strategy: ['cookie', 'globalVariable', 'baseLocale'],
		}),
		{
			name: 'remove-unwanted-public',
			async writeBundle() {
				const foldersToRemove = [
					'wc/lit/api',
					'wc/lit/html',
					'wc/lit/css',
					'wc/lit/dummy',
					'wc/lit/libs',
					'wc/vue/api',
					'wc/vue/html',
					'wc/vue/css',
					'wc/vue/dummy',
					'wc/vue/libs',
					'wc/vue/images',
					'wc/svelte/api',
					'wc/svelte/html',
					'wc/svelte/css',
					'wc/svelte/dummy',
					'wc/svelte/libs',
					'mockServiceWorker.js',
				];

				for (const folder of foldersToRemove) {
					await fs.rm(folder, { recursive: true, force: true });
				}
			},
		},
	],
});
