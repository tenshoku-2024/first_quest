<script setup lang="ts">

import {SymbolPublisher} from 'pubsub-symbol-mempool';
import {ref} from 'vue';

const node=ref('https://hostname:3001');
const secret_key=ref('');
const address=ref('');
const message=ref('');

let pub:SymbolPublisher;

let need_update=true;

function changed(){
	need_update=true;
}

async function publish(){
	if(need_update){
		pub=new SymbolPublisher(secret_key.value);
		need_update=false;
		await pub.start([node.value]);
	}
	await pub.publish(address.value,new TextEncoder().encode(message.value));
}
</script>

<template>
	<div class="p-4 m-4 border-blue-300 border-2">
		<h3 class="text-2xl p-2">
			Publisher側の機能の実演
		</h3>
		<div>
			ノードからノードのリストを調達して、そのリストのノードにメッセージつきのTransferのtransactionを送ります。
			そのtransactionと署名を作るために秘密鍵と宛先が必要です。
		</div>
		<div class="">
			秘密鍵:<input v-model="secret_key" class="rounded border-blue-500 border-2" type="text" @change="changed"/>
		</div>
		<div class="">
			最初に接続するノード:<input v-model="node" class="rounded border-blue-500 border-2" type="text" @change="changed"/>
		</div>
		<div class="">
			宛先のアドレス:<input v-model="address" class="rounded border-blue-500 border-2" type="text" />
		</div>
		<div class="">
			メッセージ:<input v-model="message" class="rounded border-blue-500 border-2" type="text" />
		</div>
		<div class="">
			<button class="rounded-xl border-blue-500 border-2 p-2" @click="publish">
				Publish
			</button>
		</div>
	</div>
</template>
