<script setup lang="ts">

import {ref} from 'vue';
import {Symp2p} from 'symp2p';

const message=ref('');
const address=ref('TCHAT2MF5MQLZJQYGSLHJIHU424P3QJGWLC7GNA');
const topic=ref('TCHAT2MF5MQLZJQYGSLHJIHU424P3QJGWLC7GNA');
const node=ref('https://host_name:3001');
const secret_key=ref('0000000000000000000000000000000000000000000000000000000000000000');

let tweets=ref(<{
	timestamp:number,
	content:string,
}[]>[
]);

let symp2p:any;

async function start(){
	symp2p=new Symp2p(secret_key.value);
	await symp2p.start([node.value]);
	symp2p.subscribe(address.value);
	symp2p.helia.libp2p.services.pubsub.subscribe(topic.value);
	symp2p.helia.libp2p.services.pubsub.addEventListener(
		'message',
		(message:any)=>{
			tweets.value.unshift(
				{
					timestamp:new Date().valueOf(),
					content:new TextDecoder().decode(message.detail.data),
				},
			);
		},
	);
}

async function tweet(){
	const tweet={
		timestamp:new Date().valueOf(),
		content:message.value,
	};
	tweets.value.unshift(tweet);
	symp2p.helia.libp2p.services.pubsub.publish(topic.value,new TextEncoder().encode(message.value));
}

async function advertise(){
	await symp2p.advertise(address.value);
}

</script>

<template>
	<div class="p-4 m-4 border-blue-300 border-2">
		<h3 class="text-2xl p-2">
			作りかけフライヤー
		</h3>
		<div>
			チャットです。WANを越えてチャットができない問題が未修正です。
		</div>
		<div class="">
			秘密鍵:<input v-model="secret_key" class="rounded border-blue-500 border-2" type="text"/>
		</div>
		<div class="">
			最初に接続するノード:<input v-model="node" class="rounded border-blue-500 border-2" type="text"/>
		</div>
		<div class="">
			宛先のアドレス:<input v-model="address" class="rounded border-blue-500 border-2" type="text" />
		</div>
		<div class="">
			トピック:<input v-model="topic" class="rounded border-blue-500 border-2" type="text" />
		</div>
		<div class="">
			メッセージ:<input v-model="message" class="rounded border-blue-500 border-2" type="text" />
		</div>
		<div class="">
			<button class="rounded-xl border-blue-500 border-2 p-2" @click="start">
				接続
			</button>
			<button class="rounded-xl border-blue-500 border-2 p-2" @click="tweet">
				つぶやく
			</button>
			<button class="rounded-xl border-blue-500 border-2 p-2" @click="advertise">
				Symbolで見つけてもらう
			</button>
		</div>
		<div>
			<div>
				みんなのつぶやき：
			</div>
			<div v-for="tweet in tweets">
				<span class="text-blue-400">
					{{new Date(tweet.timestamp).toLocaleString()}}
				</span>
				&nbsp;
				<span>
					{{tweet.content}}
				</span>
			</div>
		</div>
	</div>
</template>
