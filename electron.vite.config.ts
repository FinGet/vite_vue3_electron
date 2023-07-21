import { resolve } from 'path';

import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Unocss from 'unocss/vite';
import { presetUno, presetAttributify } from 'unocss';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      Unocss({
        presets: [presetUno(), presetAttributify()],
        shortcuts: {
          'flex-center': 'flex items-center justify-center',
          cp: 'cursor-pointer',
          'flex-between': 'flex items-center justify-between',
          'flex-column-center': 'flex items-center flex-col'
        },
        // 自定义规则
        rules: [
          ['m-1', { margin: '0.25rem' }],
          [/w-c-(\d+(\.?\d+)?)$/, (match) => ({ width: `calc(100% - ${match[1]}rem)` })],
          [/h-c-(\d+(\.?\d+)?)$/, (match) => ({ height: `calc(100% - ${match[1]}rem)` })],
          [/h-c-px-(\d+(\.?\d+)?)$/, (match) => ({ height: `calc(100% - ${match[1]}px)` })],
          [/^fs-(\d+\.{0,1}\d{0,2})$/, ([, d]) => ({ 'font-size': `${d}px` })]
        ]
      }),
      AutoImport({
        imports: ['vue'],
        dts: resolve('src/renderer/src/auto-imports.d.ts'),
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dirs: [resolve(__dirname, 'src/renderer/src/components')],
        resolvers: [
          IconsResolver({
            componentPrefix: 'icon',
            customCollections: ['custom']
          }),
          ElementPlusResolver()
        ]
      }),
      Icons({
        compiler: 'vue3',
        customCollections: {
          custom: FileSystemIconLoader('src/renderer/src/assets/icons')
        }
      })
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    }
  }
});
