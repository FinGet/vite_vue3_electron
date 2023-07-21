import { createI18n } from 'vue-i18n';

const localPathPrefix = '../locales/';

// https://vitejs.dev/guide/features.html#glob-import
const messages = Object.fromEntries(
  Object.entries(import.meta.globEager('../locales/*.ts')).map(([key, value]) => {
    console.log(key, value);
    return [key.slice(localPathPrefix.length, -3), (value as any).default];
  })
);

console.log(messages);

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  globalInjection: true,
  messages
});

export default i18n;
