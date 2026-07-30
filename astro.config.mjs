import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://leahdick-dev.com',
  build: { format: 'directory' },
  integrations: [sitemap()],
  adapter: cloudflare(),
})