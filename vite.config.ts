import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { doapMetadataPlugin } from './.workspace/scripts/doap-metadata'

export default defineConfig({
    plugins: [
        react(),
        doapMetadataPlugin({
            doapPath: './doap.json'
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        // Optimize for Arweave deployment
        target: 'es2015',
        minify: 'esbuild',
        sourcemap: false, // Reduce deployment size
        // Chunk splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                },
            },
        },
        assetsInlineLimit: 4096, // Inline small assets
        chunkSizeWarningLimit: 1000,
    },
    // Use relative paths for Arweave deployment
    base: './',
})

