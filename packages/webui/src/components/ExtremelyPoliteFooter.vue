<script setup lang="ts">

</script>

<template>
	<footer class="text-white bg-gradient-to-br from-blue-700 to-cyan-500">
		<h2 class="text-6xl p-10">
			<router-link to="/" class="underline">
				まい月の成果物
			</router-link>
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
					みんな向け
				</h3>
				<ul>
					<li>
						<router-link to="/chat" class="underline">
							Flyer
						</router-link>
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
