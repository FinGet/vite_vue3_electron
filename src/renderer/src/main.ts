import { createApp } from 'vue';

import App from './App.vue';
import pinia from './store';
import router from './router';
import 'uno.css';
import i18n from './plugins/i18n';

const app = createApp(App);

app.use(router).use(pinia).use(i18n).mount('#app');
