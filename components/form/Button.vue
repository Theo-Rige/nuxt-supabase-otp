<script lang="ts" setup>
const props = defineProps({
	loading: {
		type: Boolean,
		default: false
	}
})

const classes = computed(() => {
	return {
		'cursor-wait': props.loading
	}
})
</script>

<template>
	<button :disabled="props.loading"
			class="flex items-center justify-center gap-6 bg-blue-500 px-4 py-2 rounded text-white disabled:cursor-wait">
		<AppIcon v-if="props.loading" class="animate-spin" name="loader"/>
		<slot v-else/>
	</button>
</template>