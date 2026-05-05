// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rss from '@astrojs/rss';
import react from '@astrojs/react';
import { defineConfig, fontProviders } from 'astro/config';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

// https://astro.build/config
export default defineConfig({
	site: 'https://hogecode.github.io/articles',
	base: '/',
	output: 'static',
	integrations: [
		mdx({
			remarkPlugins: [remarkGfm],
			rehypePlugins: [
				[
					rehypePrettyCode,
					{
						theme: 'github-dark',
					},
				],
			],
		}),
		sitemap(),
		react(),
	],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
