<script setup lang="ts">

import Publisher from '@/components/Publisher.vue';
import Subscriber from '@/components/Subscriber.vue';
import Chat from '@/components/Chat.vue';
import TokenMetadataEdit from '@/components/TokenMetadataEdit.vue';
import TokenMetadataView from '@/components/TokenMetadataView.vue';
import ExtremelyPoliteLayout from '@/components/ExtremelyPoliteLayout.vue';

</script>

<template>
	<ExtremelyPoliteLayout>
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
			<TokenMetadataEdit/>
			<TokenMetadataView/>
			<Chat/>
			<Publisher/>
			<Subscriber/>
		</div>
	</ExtremelyPoliteLayout>
</template>
