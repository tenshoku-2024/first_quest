<script setup lang="ts">

import {
	inject,
	ref,
} from 'vue';

import {useRouter} from 'vue-router';

import {Symp2p} from 'symp2p';

const router=useRouter();
const globals:any=inject('globals');
const secret_key=ref('');
const node_origin=ref('https://localhost:3001');

function connect(){
	const symp2p=new Symp2p(secret_key.value);
	(async()=>{
		await symp2p.start([node_origin.value]);
		router.push('/chat');
		symp2p.subscribe(globals.value.symbolAddress)
		await symp2p.advertise();
	})();
	globals.value.symp2p=symp2p;
}
</script>

<template>
	<header>
		<div class="min-h-screen w-screen bg-gradient-to-br from-fuchsia-900 to-black grid grid-rows-2 grid-cols-1 items-center">
			<div>
				<h2 class="text-8xl font-black bg-gradient-to-br from-cyan-300 to-blue-500 inline-block text-transparent bg-clip-text">
					Gossipsubをなる速で
				</h2>
			</div>
			<div class="text-white p-8 text-[16pt] w-1/2 justify-self-end">
				<p>
					「ただ単にLibp2pとGossipsubでPubSubをしてもpublishもsubscribeもできない！？なぜ……」
				</p>
				<p>
					そんな経験ありませんか？
				</p>
				<p>
					InsufficientPeersに悩まされてませんか？
				</p>
				<p>
					この問題をSymbolを使って迂回しました。
				</p>
			</div>
		</div>
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
	</header>
	<main>
		<div class="min-h-screen w-screen bg-gradient-to-br from-rose-900 to-black grid grid-rows-1 grid-cols-1 justify-items-center items-center">
			<div class="text-black p-8 text-[16pt] max-w-screen justify-self-right rounded-2xl bg-gray-300">
				<h3 class="text-4xl border-b-2 border-gray-500">
					はじめる
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
	</main>
	<footer class="text-white bg-gradient-to-br from-blue-700 to-cyan-500">
		<h2 class="text-6xl p-10">
			作りかけ本番環境Flyer
		</h2>
		<div class="flex justify-center p-4 flex-row space-x-8">
			<div class="min-w-[30%]">
				<h3 class="text-xl">
					開発者向け
				</h3>
				<ul>
					<li>
						<router-link to="/kuyou" class="underline">
							隠し機能
						</router-link>
					</li>
					<li>
						<a href="/source.tar.zst" class="underline">
							ソースコード
						</a>
					</li>
				</ul>
			</div>
			<div class="min-w-[30%]">
				<h3 class="text-xl">
					関連
				</h3>
				<ul>
					<li>
						<a href="https://twitter.com/doce_frailes" class="underline">
							作者のTwitter
						</a>
					</li>
					<li>
						<a href="https://quest-bc.com/quest/EXeNEv4muvytfGFHMRZG" class="underline">
							これのQUESTのページ
						</a>
					</li>
					<li>
						<a href="https://hackathon-2024.nemtus.com" class="underline">
							提出先のハッカソン
						</a>
					</li>
				</ul>
			</div>
		</div>
	</footer>
</template>
