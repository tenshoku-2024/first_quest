import {Buffer} from 'buffer';
(globalThis as any).Buffer=Buffer as any;
(globalThis as any).global=globalThis as any;

import {
	createApp,
	shallowRef,
} from 'vue';
import App from '@/App.vue';
import router from '@/router.ts';

import '@/index.css';

const app=createApp(App);

app.use(router);
app.provide('globals',shallowRef({
	symbolAddress:'TCHAT2MF5MQLZJQYGSLHJIHU424P3QJGWLC7GNA',
	libp2pPubsubTopic:'TCHAT2MF5MQLZJQYGSLHJIHU424P3QJGWLC7GNA',
	symp2p:undefined,
}));
app.mount('#app');
