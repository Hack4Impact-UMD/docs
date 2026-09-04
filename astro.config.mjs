// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeRapidePlugin from 'starlight-theme-rapide';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://hack4impact-umd.github.io',
  base: '/docs',
  integrations: [
    starlight({
      title: 'H4I-UMD Engineering Docs',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/hack4impact-umd' }],
      customCss: ['./src/styles/global.css'],
      components: {
        PageTitle: './src/components/PageTitle.astro',
      },
      sidebar: [
        {
          label: 'Overview',
          items: [
            // Each item here is one entry in the navigation menu.
            { slug: 'welcome' },
            { slug: 'contributing' },
          ],
        },
        {
          label: 'Tech Lead Resources',
          items: [
            // Each item here is one entry in the navigation menu.
            { slug: 'tl/tech-stack' },
          ],
        },
        {
          label: 'General Engineering Resources',
          items: [
            // Each item here is one entry in the navigation menu.
            { slug: 'engineering/best-practices' },
            { slug: 'engineering/writing-react' },
          ],
        },
        // {
        //   label: 'Guides',
        //   items: [
        //     // Each item here is one entry in the navigation menu.
        //     { slug: 'guides/example' },
        //   ],
        // },
        // {
        //   label: 'Reference',
        //   items: [{ autogenerate: { directory: 'reference' } }],
        // },
      ],
      plugins: [starlightThemeRapidePlugin()]
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
