<script setup lang="ts">

import {
	defineModel,
} from 'vue';

const show=defineModel();

function close(){
	show.value=false;
}

</script>

<template>
	<div v-if="show" class="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
		<div class="absolute top-0 left-0 w-screen h-screen z-40 opacity-50 bg-black" @click="close">
		</div>
		<div class="z-50 w-fit h-fit grow-0">
			<slot/>
		</div>
	</div>
</template>
