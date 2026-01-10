import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        assetsDir: 'assets',
        chunkSizeWarningLimit: 1500, // Phaser is ~1.5MB, this suppresses the warning
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser'], // Separate Phaser into its own chunk for better caching
                },
            },
        },
    }
});
