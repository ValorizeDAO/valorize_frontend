import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import polyfillNode from "rollup-plugin-polyfill-node"
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [polyfillNode(), vue()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [polyfillNode()],
    },
  },
})
