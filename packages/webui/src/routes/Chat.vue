<script setup lang="ts">

import {
	inject,
	ref,
} from 'vue';

import {useRouter} from 'vue-router';

import {strings} from '@helia/strings';
import {dagCbor} from '@helia/dag-cbor';
import {CID} from 'multiformats/cid';
import {identity} from 'multiformats/hashes/identity';
import symbolSdk from 'symbol-sdk';

const router=useRouter();
const globals:any=inject('globals')
const log=ref();
const message=ref('');
const messages=ref<any[]>(
	[
		{
			timestamp:new Date(0).valueOf(),
			signerAddress:globals.value.chat.symbolAddress,
			message:'このはチャット一般公開です。時々Symbolのブロックチェーンに内容またはそのハッシュが書き込まれる可能性があります。',
		},
	],
);


const helia:any=globals.value.helia;
const pubsub:any=globals.value.chat.pubsub;
const facade=new symbolSdk.facade.SymbolFacade('testnet');
let heliaStrings:any;
let heliaCbor:any;

function scroll(){
	setTimeout(
		()=>{
			log.value.scrollTo(0,log.value.scrollHeight);
		},
		100,
	);
}

if(pubsub===undefined){
	router.push('/');
}else{
	heliaStrings=strings(helia);
	heliaCbor=dagCbor(helia);

	pubsub.subscribe(globals.value.chat.symbolAddress);
	pubsub.onmessage=async(message:Uint8Array,raw:any)=>{
		const signerAddress=facade.network.publicKeyToAddress(
			new symbolSdk.PublicKey(
				raw.data.transaction.signerPublicKey,
			),
		)
			.toString();
		const timestamp=new Date().valueOf();
		const cidCbor=CID.decode(message);
		if(cidCbor.multihash.code===identity.code){
			await helia.blockstore.put(cidCbor,cidCbor.multihash.digest);
		}
		const cbor=await heliaCbor.get(cidCbor);
		const cidMsg=cbor.message[0];
		if(cidMsg.multihash.code===identity.code){
			await helia.blockstore.put(cidMsg,cidMsg.multihash.digest);
		}
		const msg=await heliaStrings.get(cidMsg);
		messages.value.push(
			{
				timestamp,
				signerAddress,
				message:msg,
			},
		);
		scroll();
	};
}

async function submit(){
	const addoptions=message.value.length<200?{
		hasher:identity,
	}:undefined;
	const payload=await heliaCbor.add(
		{
			message:[
				await heliaStrings.add(
					message.value,
					addoptions,
				),
			],
		},
		addoptions,
	);
	pubsub.publish(globals.value.chat.symbolAddress,payload.bytes);
	message.value='';
}

</script>

<template>
	<div class="w-screen h-screen flex flex-col">
		<div ref="log" class="overflow-scroll grow flex flex-col bg-gradient-to-br from-cyan-200 to-indigo-200">
			<ul class="max-w-[680px] grow self-center bg-white/65 space-y-4">
				<li v-for="message in messages" class="flex flex-col">
					<div class="flex flex-col">
						<div class="grow-0">
							{{message.signerAddress}}
						</div>
						<div class="grow-0">
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
