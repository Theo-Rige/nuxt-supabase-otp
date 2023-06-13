<script lang="ts" setup>
const props = defineProps({
	submit: String,
	back: [Boolean, String]
})

const emit = defineEmits(['back'])

const form = ref<HTMLFormElement | null>(null)
const loading = ref(false)
const error = ref('')

const setLoading = (value: boolean = true) => {
	loading.value = value
}
const setError = (message: string) => {
	error.value = message
}

const clearError = () => {
	error.value = ''
}

const submit = () => {
	if (form.value) {
		form.value.dispatchEvent(new Event('submit'))
	}
}

defineExpose({
	setLoading,
	setError,
	clearError,
	submit
})
</script>

<template>
	<form ref="form" class="flex flex-col gap-6 w-full max-w-[320px]" @change="error = ''">
		<slot/>
		<div class="flex flex-row-reverse items-center gap-6">
			<FormButton v-if="props.submit" :loading="loading" class="flex-1" type="submit">{{
					props.submit
				}}
			</FormButton>
			<FormButton v-if="props.back" aria-label="Go back" type="button" @click="emit('back')">
				<AppIcon v-if="typeof props.back === 'boolean'" focusable="false" name="arrow"/>
				<template v-else>
					{{ props.back }}
				</template>
			</FormButton>
		</div>
		<span v-if="error" class="text-red-500">{{ error }}</span>
	</form>
</template>