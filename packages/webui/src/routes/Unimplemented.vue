<script setup lang="ts">

import Publisher from '@/components/Publisher.vue';
import Subscriber from '@/components/Subscriber.vue';
import Chat from '@/components/Chat.vue';

</script>

<template>
	<div class="m-4">
		<h1 class="m-4 text-4xl">
			隠し機能
		</h1>
		<div>
			<a href="/source.tar.zst">
				<button class="rounded-2xl bg-blue-500 p-2 text-white">
					ソースコードはこちら
				</button>
			</a>
		</div>
	</div>
	<div>
		<h2 class="text-3xl p-2">
			作りかけの機能
		</h2>
		<Chat/>
		<Publisher/>
		<Subscriber/>
	</div>
</template>
