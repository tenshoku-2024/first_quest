<script setup lang="ts">

import {SymbolSubscriber} from 'pubsub-symbol-mempool';
import {ref} from 'vue';

const messages=ref([]as string[]);
const node=ref('https://hostname:3001');
const address=ref('TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

let sub:SymbolSubscriber;

async function onclick(){
	sub=new SymbolSubscriber();
	sub.onmessage=(msg:any)=>{
		messages.value.push(msg.data.meta.hash);
		messages.value=messages.value.splice(-5);
	};
	await sub.start([node.value]);
	sub.subscribe(address.value);
}

</script>

<template>
	<div class="p-4 m-4 border-blue-300 border-2">
		<h3 class="text-2xl p-2">
			Subscriber側の機能の実演
		</h3>
		<div>
			Subscribeボタンを押すと、下に入力したノードに接続して、そのノードが知っているノードのリストを受け取ります。
			その中から接続できるノードを選んで、下に入力したアドレスが関係するtransactionが来た時に教えてもらいます。
			transactionが来たら下にhashが並びます。
		</div>
		<div class="">
			最初に接続するノード:<input v-model="node" class="rounded border-blue-500 border-2" type="text" />
		</div>
		<div class="">
			監視するアドレス:<input v-model="address" class="rounded border-blue-500 border-2" type="text" />
		</div>
		<div class="">
			<button class="rounded-xl border-blue-500 border-2 p-2" @click="onclick">
				Subscribe
			</button>
		</div>
		<h3>
			届いたtransactionのhash（最新５件）:
		</h3>
		<div v-for="message in messages">
			{{message}}
		</div>
	</div>
</template>
