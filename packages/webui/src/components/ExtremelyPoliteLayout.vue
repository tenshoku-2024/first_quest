<script setup lang="ts">

import ExtremelyPoliteFooter from '@/components/ExtremelyPoliteFooter.vue';
import ExtremelyPoliteHeader from '@/components/ExtremelyPoliteHeader.vue';

</script>

<template>
	<ExtremelyPoliteHeader/>
	<main>
		<slot/>
	</main>
	<ExtremelyPoliteFooter/>
</template>

