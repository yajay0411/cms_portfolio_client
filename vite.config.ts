import { defineConfig, type ConfigEnv, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react({
        reactRefreshHost: 'http://localhost:5173',
        jsxRuntime: 'automatic',
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: [
            [
              '@emotion/babel-plugin',
              {
                sourceMap: !isProduction,
                autoLabel: 'dev-only',
                labelFormat: '[local]',
                cssPropOptimization: true
              }
            ],
            isProduction && ['babel-plugin-jsx-remove-data-test-id', { attributes: ['data-testid'] }]
          ].filter(Boolean) as []
        }
      }),

      ViteImageOptimizer({
        test: /\.(jpe?g|png|gif|svg|webp|avif)$/i,
        includePublic: true,
        logStats: true,
        png: { quality: 80, compressionLevel: 9 },
        jpeg: { quality: 80 },
        jpg: { quality: 80 },
        webp: { quality: 80, lossless: false },
        avif: { quality: 70, lossless: false }
      }),

      isProduction &&
        visualizer({
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
          open: false
        })
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@core': path.resolve(__dirname, 'src/core'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@types': path.resolve(__dirname, 'src/types'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@validations': path.resolve(__dirname, 'src/validations'),
        '@libs': path.resolve(__dirname, 'src/libs'),
        '@shared': path.resolve(__dirname, 'src/shared')
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },

    build: {
      target: 'esnext',
      cssCodeSplit: true,
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 600,
      minify: 'terser', // ✅ Terser only
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]'
        },
        treeshake: {
          preset: 'recommended',
          moduleSideEffects: 'no-external',
          propertyReadSideEffects: false
        }
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          passes: 2
        },
        format: {
          comments: false
        },
        mangle: {
          toplevel: true,
          keep_classnames: /^React/,
          keep_fnames: /^React/,
          reserved: ['React', 'exports', 'require', 'module']
        }
      }
    },

    // ✅ Updated section — fix typings for Vite 6
    esbuild: {
      minifyIdentifiers: false,
      minifySyntax: false,
      minifyWhitespace: false,
      legalComments: 'none'
    },

    server: {
      port: 5173,
      open: true,
      strictPort: true,
      cors: true,
      hmr: { overlay: false },
      fs: { strict: true },
      watch: { usePolling: true }
    },

    preview: {
      port: 4173,
      strictPort: true,
      cors: true
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
      exclude: ['js-cookie', 'axios', 'react-error-boundary'],
      force: false
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/assets/styles/variable" as *;
          @use "@/assets/styles/mixins" as *;
          `
        }
      }
    },

    base: '/'
  };
});
