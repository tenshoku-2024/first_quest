<script setup lang="ts">

import ExtremelyPoliteLayout from '@/components/ExtremelyPoliteLayout.vue';

import {
	inject,
	ref,
} from 'vue';

import {useRouter} from 'vue-router';

import {SymbolPubSub} from 'pubsub-symbol-mempool';

const router=useRouter();
const globals:any=inject('globals');
const secret_key=ref('');
const node_origin=ref('https://localhost:3001');

function connect(){
	const pubsub=new SymbolPubSub(secret_key.value);
	globals.value.chat.pubsub=pubsub;
	(async()=>{
		await pubsub.start([node_origin.value]);
		pubsub.subscribe(globals.value.symbolAddress)
		router.push('/chat');
	})();
}
</script>

<template>
	<ExtremelyPoliteLayout>
		<div class="min-h-screen w-screen bg-gradient-to-br from-rose-900 to-black grid grid-rows-1 grid-cols-1 justify-items-center items-center">
			<div class="text-black p-8 text-[16pt] max-w-screen justify-self-right rounded-2xl bg-gray-300">
				<h3 class="text-4xl border-b-2 border-gray-500">
					チャットをはじめる
				</h3>
				<div>
					<h6 class="">
						秘密鍵
					</h6>
				</div>
				<div>
					<input type="password" v-model="secret_key" class="w-full"/>
				</div>
				<div>
					<h6 class="">
						テストネットのノード
					</h6>
				</div>
				<div>
					<input type="text" v-model="node_origin" class="w-full"/>
				</div>
				<div class="grid grid-col-1 grid-row-1 my-2">
					<button @click="connect" class="rounded-xl border-2 border-blue-500 bg-white p-[2px] justify-self-end w-fit">
						接続
					</button>
				</div>
			</div>
		</div>
	</ExtremelyPoliteLayout>
</template>

