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
			<div class="lg:grid lg:grid-cols-2">
				<div class="text-white p-8 text-[16pt]">
					<p>
						ブラウザで動かすのに困難の多いSymbol SDK v3をVue+Vite+TypeScriptで使うことに成功しました。
					</p>
				</div>
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
			<div class="lg:grid lg:grid-cols-2">
				<div class="text-white p-8 text-[16pt]">
					<p>
						Libp2pのGossipsubではブラウザ同士のWANを越えた通信が困難でした。
					</p>
					<p>
						そこでSymbolのmempoolを使ったPubSubを実現し、お披露目も兼ねてチャットを作りました。
					</p>
				</div>
				<div class="text-white p-8 text-[16pt] flex justify-center items-center align-items-center">
					<router-link to="/chat">
						<button class="rounded-2xl bg-white text-blue-500 border-4 border-blue-500 p-2 grow-0">
							Flyerをはじめる
						</button>
					</router-link>
				</div>
			</div>
		</div>
		<div class="min-h-screen bg-gradient-to-br to-orange-900 from-black grid grid-rows-4 grid-cols-1 items-center">
			<div>
				<h2 class="text-8xl font-black bg-gradient-to-br from-orange-200 to-red-500 inline-block text-transparent bg-clip-text">
					Immutableな
				</h2>
			</div>
			<div class="justify-self-center">
				<h2 class="text-8xl font-black bg-gradient-to-br from-orange-200 to-red-500 inline-block text-transparent bg-clip-text">
					(N)FTのメタデータを
				</h2>
			</div>
			<div class="justify-self-end">
				<h2 class="text-8xl font-black bg-gradient-to-br from-orange-200 to-red-500 inline-block text-transparent bg-clip-text">
					オンチェーンでも
				</h2>
			</div>
			<div class="lg:grid lg:grid-cols-2">
				<div class="text-white p-8 text-[16pt]">
					<p>
						小さいか不変の(N)FTに適したメタデータにオンチェーンでもオフチェーンでも共通してIPFSを使う新しい形式を提唱。
					</p>
					<p>
						たった一つの絵だけでなはく、フォルダをまるごとNFTにすることも可能な表現力。
					</p>
				</div>
				<div class="text-white p-8 text-[16pt] flex flex-wrap justify-center items-center lg:space-x-4 align-items-center">
					<router-link to="/kuyou">
						<button class="rounded-2xl bg-white text-blue-500 border-4 border-blue-500 p-2 grow-0">
							隠し機能を見る(開発者向け)
						</button>
					</router-link>
				</div>
			</div>
		</div>
	</ExtremelyPoliteLayout>
</template>
