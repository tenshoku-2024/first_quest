<script setup lang="ts">

import ExtremelyPoliteLayout from '@/components/ExtremelyPoliteLayout.vue';

</script>

<template>
	<ExtremelyPoliteLayout>
		<div class="min-h-screen bg-gradient-to-br to-cyan-900 from-black grid grid-rows-4 grid-cols-1 items-center">
			<div>
				<h2 class="text-8xl font-black bg-gradient-to-br from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text">
					Symbol SDK v3を
				</h2>
			</div>
			<div class="justify-self-center">
				<h2 class="text-8xl font-black bg-gradient-to-br from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text">
					ブラウザで
				</h2>
			</div>
			<div class="justify-self-end">
				<h2 class="text-8xl font-black bg-gradient-to-br from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text">
					Vueを使って
				</h2>
			</div>
			<div class="text-white p-8 text-[16pt] w-1/2">
				<p>
					ブラウザで動かすのに困難の多いSymbol SDK v3をVue+Vite+TypeScriptで使うことに成功しました。
				</p>
			</div>
		</div>
		<div class="min-h-screen bg-gradient-to-br to-fuchsia-900 from-black grid grid-rows-4 grid-cols-1 items-center">
			<div>
				<h2 class="text-8xl font-black bg-gradient-to-br from-rose-200 to-blue-500 inline-block text-transparent bg-clip-text">
					PubSubを
				</h2>
			</div>
			<div class="justify-self-center">
				<h2 class="text-8xl font-black bg-gradient-to-br from-rose-200 to-blue-500 inline-block text-transparent bg-clip-text">
					Symbolで
				</h2>
			</div>
			<div class="justify-self-end">
				<h2 class="text-8xl font-black bg-gradient-to-br from-rose-200 to-blue-500 inline-block text-transparent bg-clip-text">
					より単純に
				</h2>
			</div>
			<div class="flex flex-row">
				<div class="text-white p-8 text-[16pt] w-[45%]">
					<p>
						Libp2pのGossipsubではブラウザ同士のWANを越えた通信が困難でした。
					</p>
					<p>
						そこでSymbolのmempoolを使ったPubSubを実現し、お披露目も兼ねてチャットを作りました。
					</p>
				</div>
				<div class="text-white p-8 text-[16pt] w-[45%] flex justify-center items-center align-items-center">
					<router-link to="/chat">
						<button class="rounded-2xl bg-white text-blue-500 border-4 border-blue-500 p-2 grow-0">
							Flyerをはじめる
						</button>
					</router-link>
				</div>
			</div>
		</div>
	</ExtremelyPoliteLayout>
</template>
