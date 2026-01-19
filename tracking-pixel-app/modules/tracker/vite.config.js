import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'pixel.js'),
            name: 'Pixel',
            fileName: (format) => `pixel.js`,
            formats: ['iife']
        },
        outDir: 'dist',
        emptyOutDir: true,
    }
});
