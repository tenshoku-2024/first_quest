<script setup lang="ts">

import {
	inject,
	ref,
} from 'vue';

import {useRouter} from 'vue-router';

import {strings} from '@helia/strings';
import {dagCbor} from '@helia/dag-cbor';
import {CID} from 'multiformats/cid';

const router=useRouter();
const globals:any=inject('globals')
const log=ref();
const discoverable=ref('')
const numParticipants=ref(1);
const message=ref('');
const messages=ref<any[]>(
	[
		{
			timestamp:new Date(0).valueOf(),
			message:'このはチャット一般公開ですが自動でSymbolのブロックチェーンに書き込まれるようには作っていません。代わりにIPFSで配信されます。',
		}
	]
);

const {
	libp2pPubsubTopic,
	symp2p,
}=globals.value;

let helia;
let heliaStrings:any;
let heliaCbor:any;
let libp2p:any;
let pubsub:any;

function scroll(){
	log.value.scrollTo(0,log.value.scrollHeight);
}

if(symp2p===undefined){
	router.push('/');
}else{
	helia=symp2p.helia;
	libp2p=helia.libp2p;
	pubsub=libp2p.services.pubsub;

	heliaStrings=strings(helia);
	heliaCbor=dagCbor(helia);

	symp2p.subscribe(globals.value.symbolAddress);
	pubsub.subscribe(globals.value.symbolAddress);

	setInterval(
		()=>{
			numParticipants.value=pubsub.getSubscribers(libp2pPubsubTopic).length+1;
			const libp2pIsDiscoverable=libp2p
				.getMultiaddrs()
				.filter((e:any)=>e.protos().filter((f:any)=>f.name==='p2p-circuit').length>0)
				.filter((e:any)=>e.protos().filter((f:any)=>f.name==='dns4'||f.name==='dns6').length>0)
				.length>0;
			if(libp2pIsDiscoverable){
				discoverable.value='見つけてもらう準備OK';
			}else{
				discoverable.value='見つけてもらう準備KO';
				symp2p.dialLibp2pNodes();
			}
		},
		1000,
	);

	pubsub.addEventListener(
		'message',
		async(ev:any)=>{
			const message={
				timestamp:new Date().valueOf(),
				message:'',
			};
			const payload=await heliaCbor.get(CID.decode(ev.detail.data));
			message.message=await heliaStrings.get(payload.message[0]);
			messages.value.push(message);
			scroll();
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
	const payload=await heliaCbor.add(
		{
			message:[
				await heliaStrings.add(message.value),
			],
		},
	);
	await pubsub.publish(libp2pPubsubTopic,payload.bytes);
	scroll();
}

async function advertise(){
	await symp2p.advertise();
}

</script>

<template>
	<div class="w-screen h-screen flex flex-col">
		<div class="grow-0 border-b-2 border-blue-300 w-screen p-2">
			<span>
				参加者数：{{numParticipants}}
			</span>
			&nbsp;
			<button @click="advertise" class="rounded-xl p-[1px] border-2 border-blue-500">
				見つけてもらう
			</button>
			&nbsp;
			{{discoverable}}
		</div>
		<div ref="log" class="overflow-scroll grow flex flex-col bg-gradient-to-br from-cyan-200 to-indigo-200">
			<ul class="max-w-[600px] grow self-center bg-white/65 space-y-4">
				<li v-for="message in messages" class="flex flex-col">
					<div class="">
						<div class="">
							{{new Date(message.timestamp).toLocaleString()}}
						</div>
					</div>
					<div>
						{{message.message}}
					</div>
				</li>
			</ul>
		</div>
		<div class="grow-0">
			<form @submit.prevent="submit">
				<input type="text" v-model="message" placeholder="つぶやきを書いてEnter" class="border-blue-500 border-2 w-full"/>
			</form>
		</div>
	</div>
</template>
