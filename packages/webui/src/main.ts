import {Buffer} from 'buffer';
(globalThis as any).Buffer=Buffer as any;
(globalThis as any).global=globalThis as any;

import {createApp} from 'vue';
import App from '@/App.vue';
import router from '@/router.ts';

import '@/index.css';

const app=createApp(App);

app.use(router);
app.mount('#app');
