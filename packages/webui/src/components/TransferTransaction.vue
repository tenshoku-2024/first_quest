<script setup lang="ts">

import {
	defineEmits,
	defineProps,
	inject,
	ref,
} from 'vue';

import symbolSdk from 'symbol-sdk';

const globals=inject('globals');

const props=defineProps<{
	recipientAddress:string,
}>();

const nodeOrigins=globals.value.chat.pubsub.publisher.nodes;
const nodeOrigin=nodeOrigins[(nodeOrigins.length*Math.random())>>>0];

const emit=defineEmits(
	[
		'announce',
	],
)

const amount=ref('0');

const facade=new symbolSdk.facade.SymbolFacade('testnet');

const mosaics=ref(undefined);
const mosaic=ref('');
(async()=>{
	const json=await fetch(
		nodeOrigin+'/accounts/'+props.recipientAddress,
	)
		.then(response=>response.json());
	mosaics.value=await Promise.all(
		json.account.mosaics.map(
			async(e)=>{
				const json=await fetch(
					nodeOrigin+'/mosaics/'+e.id,
				)
					.then(response=>response.json());
				return {
					...e,
					divisibility:json.mosaic.divisibility,
				};
			}
		),
	);
})();

async function announce(){
	const divisibility=mosaics.value.filter(e=>e.id==mosaic.value)[0].divisibility;
	const positionOfDot=-1*(amount.value.lastIndexOf('.')-amount.value.length+1);

	const src_private=new symbolSdk.PrivateKey(globals.value.chat.secret_key);
	const src_pair=new symbolSdk.symbol.KeyPair(src_private);
	const src_address=facade.network.publicKeyToAddress(src_pair.publicKey);

	const deadline=new symbolSdk.symbol.NetworkTimestamp(facade.network.fromDatetime(new Date)).addSeconds(60).timestamp;

	const tx=facade.transactionFactory.create({
		type:'transfer_transaction_v1',
		signerPublicKey:src_pair.publicKey,
		recipientAddress:props.recipientAddress,
		mosaics:[
			{
				mosaicId:BigInt('0x'+mosaic.value),
				amount:BigInt(amount.value.replace('.',''))*10n**BigInt(divisibility-positionOfDot),
			}
		],
		deadline,
	});

	tx.fee=new symbolSdk.symbol.Amount(BigInt(tx.size)*100n);

	const sig=facade.signTransaction(src_pair,tx);
	const signed_tx_json=(facade.transactionFactory.constructor as any).attachSignature(tx,sig);

	await fetch(
		nodeOrigin+'/transactions',
		{
			method:'PUT',
			headers:{
				'Content-Type':'application/json',
			},
			body:signed_tx_json,
		},
	)

	facade.transactionFactory.create({
		type:'transfer_transaction_v1',
	})
	emit('announce');
}

</script>

<template>
	<div class="rounded-2xl bg-white p-4 max-w-[400px] flex flex-col space-y-2">
		<h3 class="text-4xl m-2">
			投げモザイク
		</h3>
		<div>
			<div>
				宛先:
			</div>
			<div class="w-full text-sm p-2 border-b-2 border-blue-500 overflow-hidden">
				{{recipientAddress}}
			</div>
		</div>
		<div>
			<div>
				モザイク:
			</div>
			<select v-model="mosaic">
				<template v-if="!mosaics">
					<option value="">Loading...</option>
				</template>
				<template v-else-if="mosaics.length==0">
					<option value="">No Mosaic</option>
				</template>
				<template v-else>
					<option v-for="mosaic in mosaics" :value="mosaic.id">{{mosaic.id}} ({{mosaic.amount/Math.pow(10,mosaic.divisibility)}})</option>
				</template>
			</select>
		</div>
		<div>
			<div>
				数量:
			</div>
			<input v-model="amount" type="text" class="w-full p-2 border-b-2 border-blue-500">
		</div>
		<div class="flex justify-end">
			<button class="rounded-xl p-2 border-2 border-blue-500 grow-0" @click="announce">
				投げる
			</button>
		</div>
	</div>
</template>
