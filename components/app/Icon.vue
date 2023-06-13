<script lang="ts" setup>
const props = defineProps({
	name: {
		type: String,
		required: true
	}
})
</script>

<template>
	<svg fill="none" height="24" stroke="currentColor" stroke-linecap="round"
		 stroke-linejoin="round"
		 stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
		<template v-if="props.name === 'loader'">
			<path d="M21 12a9 9 0 1 1-6.219-8.56"/>
		</template>
		<template v-else-if="props.name === 'arrow'">
			<line x1="19" x2="5" y1="12" y2="12"/>
			<polyline points="12 19 5 12 12 5"/>
		</template>
	</svg>

</template>