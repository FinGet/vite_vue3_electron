import { createApp } from 'vue';

import App from './App.vue';
import pinia from './store';
import router from './router';
import 'uno.css';

const app = createApp(App);

app.use(router).use(pinia).mount('#app');
