<script setup lang="ts">

import {
	inject,
	ref,
} from 'vue';

import {useRouter} from 'vue-router';

const router=useRouter();
const globals:any=inject('globals')

const numParticipants=ref(1);
const message=ref('');
const messages=ref<any[]>(
	[
		{
			timestamp:new Date().valueOf(),
			message:'このはチャット一般公開ですが自動でSymbolのブロックチェーンに書き込まれるようには作っていません。',
		}
	]
);

const {
	libp2pPubsubTopic,
	symp2p,
}=globals.value;

let helia;
let libp2p;
let pubsub:any;

if(symp2p===undefined){
	router.push('/');
}else{
	helia=symp2p.helia;
	libp2p=helia.libp2p;
	pubsub=libp2p.services.pubsub;

	symp2p.subscribe(globals.value.symbolAddress);
	pubsub.subscribe(globals.value.symbolAddress);

	setInterval(
		()=>{
			numParticipants.value=pubsub.getSubscribers(libp2pPubsubTopic).length+1;
		},
		1000,
	);

	pubsub.addEventListener(
		'message',
		(ev:any)=>{
			messages.value.push(
				{
					timestamp:new Date().valueOf(),
					message:new TextDecoder().decode(ev.detail.data),
				},
			)
		}
	)
}

async function submit(){
	messages.value.push(
		{
			timestamp:new Date().valueOf(),
			message:message.value,
		},
	);
	await pubsub.publish(libp2pPubsubTopic,new TextEncoder().encode(message.value));
}

async function advertise(){
	await symp2p.advertise();
}

</script>

<template>
	<div class="w-screen h-screen flex flex-col">
		<div class="grow-0 border-b-2 w-screen">
			<span>
				参加者数：{{numParticipants}}
			</span>
			&nbsp;
			<button @click="advertise" class="rounded-xl p-[1px] border-2 border-blue-500">
				見つけてもらう
			</button>
		</div>
		<ul class="max-w-[600px] grow">
			<li v-for="message in messages" class="flex flex-col space-x-4">
				<div class="flex flex-row">
					{{new Date(message.timestamp).toLocaleString()}}
				</div>
				<div>
					{{message.message}}
				</div>
			</li>
		</ul>
		<div class="grow-0">
			<form @submit.prevent="submit">
				<input type="text" v-model="message" placeholder="つぶやきを書いてEnter" class="border-blue-500 border-2 w-full"/>
			</form>
		</div>
	</div>
</template>
