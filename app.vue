<script lang="ts" setup>
useHead({
	title: 'Nuxt 3 Template',
	htmlAttrs: {
		lang: 'en',
	},
})
</script>

<template>
	<NuxtLayout>
		<NuxtLoadingIndicator/>
		<NuxtPage/>
	</NuxtLayout>
</template>