import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  site: 'https://patonz.github.io/patonz-cup',
  base: '/patonz-cup/',
  integrations: [tailwind({ applyBaseStyles: false })],
});
