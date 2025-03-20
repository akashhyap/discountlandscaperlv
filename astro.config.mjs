// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    compress({
      CSS: true,
      HTML: true,
      Image: false, // We'll handle image optimization separately
      JavaScript: true,
      SVG: true,
    }),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        // Advanced Sharp options for better compression
        avif: {
          quality: 60, // Better quality for AVIF while maintaining good compression
          effort: 7, // High compression effort (0-9)
          chromaSubsampling: '4:2:2', // Less aggressive subsampling
        },
        webp: {
          quality: 70, // Better quality for WebP while maintaining good compression
          effort: 5, // High compression effort (0-6)
          smartSubsample: true, // Improves compression without noticeable quality loss
          reductionEffort: 4, // Moderate reduction effort
        },
        jpeg: {
          quality: 75, // Better quality for JPEG while maintaining good compression
          progressive: true, // Progressive loading
          mozjpeg: true, // Use mozjpeg for better compression
          trellisQuantisation: true, // Better compression
          overshootDeringing: true, // Better compression
        },
        png: {
          quality: 75,
          compressionLevel: 8, // High compression (0-9)
          adaptiveFiltering: true, // Better compression
        }
      }
    },
    domains: ['api.leadconnectorhq.com'], // Allow optimizing images from this domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.leadconnectorhq.com',
      },
    ],
  },
  // Add build optimization
  build: {
    inlineStylesheets: 'auto', // Inline small stylesheets
  },
  // Add performance optimization for scripts
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // Group vendor scripts
            vendor: [
              // Add any third-party libraries here
            ],
          },
        },
      },
    },
    ssr: {
      noExternal: ['@astrojs/*'],
    },
    optimizeDeps: {
      exclude: ['@astrojs/image'],
    },
  },
});