<script setup lang="ts">

import ExtremelyPoliteFooter from '@/components/ExtremelyPoliteFooter.vue';
import ExtremelyPoliteHeader from '@/components/ExtremelyPoliteHeader.vue';

</script>

<template>
	<ExtremelyPoliteHeader/>
	<main class="min-h-screen">
		<slot/>
	</main>
	<ExtremelyPoliteFooter/>
</template>

