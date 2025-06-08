import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  return {
    plugins: [
      react({
        reactRefreshHost: 'http://localhost:3000',
        jsxRuntime: 'automatic',
        babel: {
          plugins: isProduction ? ['babel-plugin-jsx-remove-data-test-id'] : [],
        },
      }),

      ViteImageOptimizer({
        test: /\.(jpe?g|png|gif|svg)$/i,
        includePublic: true,
        logStats: true,
        png: {
          quality: 80,
          compressionLevel: 9,
        },
        jpeg: {
          quality: 80,
        },
        jpg: {
          quality: 80,
        },
        webp: {
          lossless: false,
          quality: 80,
        },
        avif: {
          lossless: false,
          quality: 70,
        },
      }),

      // Bundle Visualizer (Only for analysis)
      isProduction ? visualizer({ filename: 'dist/stats.html' }) : null,
    ].filter(Boolean), // Removes falsy values

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@core': path.resolve(__dirname, 'src/core'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@constants': path.resolve(__dirname, 'src/constants'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },

    build: {
      target: 'esnext',
      minify: isProduction ? 'terser' : false,
      sourcemap: isProduction ? false : 'inline',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0];
            }
          },
          chunkFileNames: `assets/[name]-[hash].js`,
          entryFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash][extname]`,
        },
        treeshake: {
          preset: 'recommended',
          moduleSideEffects: 'no-external',
          propertyReadSideEffects: false,
        },
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: ['console.info', 'console.debug'],
          dead_code: true,
          passes: 2,
        },
        format: {
          comments: false, // Remove all comments
          beautify: false,
        },
      },
    },

    server: {
      port: 3000,
      strictPort: true,
      open: true,
      hmr: {
        overlay: false,
      },
      fs: {
        strict: true,
        allow: ['..'],
      },
      watch: {
        usePolling: true,
      },
    },

    preview: {
      port: 4173,
      strictPort: true,
    },

    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
      legalComments: 'none',
      minifyWhitespace: isProduction,
      minifyIdentifiers: isProduction,
      minifySyntax: isProduction,
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@mui/material',
        '@mui/icons-material',
      ],
      exclude: ['js-cookie', 'axios', 'react-error-boundary'],
      force: isProduction,
    },

    base: '/',
  };
});
