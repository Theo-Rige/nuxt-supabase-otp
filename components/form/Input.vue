<script lang="ts" setup>
const props = defineProps({
	type: {
		type: String,
		default: 'text'
	},
	label: {
		type: String,
		default: ''
	},
	name: {
		type: String,
		default: ''
	},
	required: {
		type: Boolean,
		default: false
	},
	digits: {
		type: Number,
		default: 6
	}
})

const emit = defineEmits(['full'])

const digits = ref<HTMLInputElement[] | null>(null)
const value = defineModel<string>()

const handleKeydown = (event: KeyboardEvent, index: number) => {
	if (event.key !== 'Tab' && event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && !(event.key === 'v' && event.ctrlKey)) {
		event.preventDefault()
	}

	if (event.key === 'Backspace' || event.key === 'Delete') {
		if (index > 0) {
			digits.value?.[index - 1].focus()
		}
		value.value = (value.value as string).substring(0, index) + (value.value as string).substring(index + 1);
		return
	}

	if ((new RegExp('^([0-9])$')).test(event.key)) {
		if (index < props.digits - 1) {
			digits.value?.[index + 1].focus()
		}
		value.value = (value.value as string).substring(0, index) + event.key + (value.value as string).substring(index + 1);
		if (index === props.digits - 1) {
			emit('full')
		}
	}
}

const handlePaste = (event: ClipboardEvent) => {
	const pastedData = event.clipboardData?.getData('text/plain')
	if (pastedData) {
		if (!(new RegExp('^([0-9])+$')).test(pastedData) || pastedData.length > props.digits) {
			event.preventDefault()
			return
		}
		value.value = pastedData;
		emit('full')
	}
}
</script>

<template>
	<label class="flex flex-wrap gap-2">
		<span class="basis-full">{{ props.label }}</span>
		<template v-if="props.type === 'otp'">
			<input v-for="index in props.digits" ref="digits" :name="'token_' + index"
				   :value="(value as string)[index - 1]"
				   class="h-10 text-center border border-slate-300 rounded min-w-[40px] grow basis-0"
				   maxlength="1"
				   type="text"
				   @keydown="handleKeydown($event, index - 1)"
				   @paste="handlePaste($event)">
		</template>
		<input v-else v-model="value" :name="props.name" :required="props.required" :type="props.type"
			   class="h-10 w-full px-4 border border-slate-300 rounded">
	</label>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[type=number] {
	-moz-appearance: textfield;
}
</style>