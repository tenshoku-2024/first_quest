import {Buffer} from 'buffer';
(globalThis as any).Buffer=Buffer as any;
(globalThis as any).global=globalThis as any;

import {
	createApp,
	shallowRef,
} from 'vue';
import App from '@/App.vue';
import router from '@/router.ts';

import {createHeliaWithAdditionalBootstrapNodes} from '@/helia.ts';

import '@/index.css';

const app=createApp(App);
const globals=shallowRef(
	<any>{
		chat:{
			symbolAddress:'TCHAT2MF5MQLZJQYGSLHJIHU424P3QJGWLC7GNA',
			pubsub:undefined,
		},
	},
);

(async()=>{
	globals.value.helia=await createHeliaWithAdditionalBootstrapNodes();
})();

app.use(router);
app.provide(
	'globals',
	globals,
);
app.mount('#app');
