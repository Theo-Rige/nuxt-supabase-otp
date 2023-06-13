<script lang="ts" setup>
import {FormContainer} from '#components'

const client = useSupabaseAuthClient()
const router = useRouter()

definePageMeta({
	layout: "auth",
	middleware: 'auth'
})

interface Timer {
	value: number
	interval: ReturnType<typeof setInterval> | null
}

const step = ref(0)
const forward = ref(true)
const form = ref<InstanceType<typeof FormContainer> | null>(null)
const timer: Timer = reactive({
	value: 60,
	interval: null
})
const data = reactive({
	email: '',
	username: '',
	full_name: '',
	token: ''
})

const back = () => {
	forward.value = false
	step.value = 0
	setTimeout(() => {
		forward.value = true
	}, 300)
}

const auth = async () => {
	form.value?.setLoading()
	await useFetch(`/api/users/${data.email}`, {
		onRequestError() {
			form.value?.setError('Something went wrong')
			form.value?.setLoading(false)
		},
		onResponseError({error}) {
			form.value?.setError(error?.message)
			form.value?.setLoading(false)
		},
		onResponse({response}) {
			if (response.status === 200 && response._data.user.length > 0) {
				register()
			} else {
				step.value = 1
				form.value?.setLoading(false)
			}
		}
	})
}

const register = async () => {
	form.value?.clearError()
	form.value?.setLoading()
	const options = {
		shouldCreateUser: Object.values(data).some(value => !value),
		emailRedirectTo: 'http://localhost:3000/',
		data: {}
	}

	if (Object.values(data).some(value => !value)) {
		options.data = {
			...data
		}
	}

	const {error} = await client.auth.signInWithOtp({
		email: data.email,
		options: options
	})

	if (error) {
		form.value?.setError(error.message)
	} else {
		localStorage.setItem('last-otp-send', Date.now().toString())
		timer.value = 60
		if (timer.interval) {
			clearInterval(timer.interval)
		}
		timer.interval = setInterval(() => {
			timer.value = Math.max(timer.value - 1, 0)
		}, 1000)
		step.value = 2
	}
	form.value?.setLoading(false)
}

const verify = async () => {
	form.value?.setLoading()
	const {error} = await client.auth.verifyOtp({email: data.email, token: data.token, type: 'email'})

	if (error) {
		form.value?.setError(error.message)
		form.value?.setLoading(false)
	} else {
		await router.push('/')
	}
}

onBeforeMount(() => {
	const last = localStorage.getItem('last-otp-send')
	if (last) {
		const difference = Math.floor((Date.now() - parseInt(last)) / 1000)
		timer.value = Math.max(60 - difference, 0)
	}
})
</script>

<template>
	<main class="min-h-screen flex justify-center items-center">
		<section class="h-full w-fit flex flex-col gap-10">
			<Transition :name="forward ? 'forward-slide-fade' : 'backward-slide-fade'" mode="out-in">
				<FormContainer v-if="step === 0" :ref="(el) => { step === 0 ? form = el : null }"
							   submit="Continue"
							   @submit.prevent="auth">
					<h1 class="font-medium text-2xl">What is your email adress ?</h1>
					<FormInput v-model="data.email" label="Email" name="email" required type="email"/>
				</FormContainer>
				<FormContainer v-else-if="step === 1" :ref="(el) => { step === 1 ? form = el : null }" back
							   submit="Register"
							   @back="back"
							   @submit.prevent="register">
					<h1 class="font-medium text-2xl">Create your account</h1>
					<FormInput v-model="data.username" label="Username" name="Username" required/>
					<FormInput v-model="data.full_name" label="Full name" name="full_name" required/>
				</FormContainer>
				<FormContainer v-else-if="step === 2" :ref="(el) => { step === 2 ? form = el : null }" back
							   submit="Verify" @back="back" @submit.prevent="verify">
					<h1 class="font-medium text-2xl">Verify your email</h1>
					<FormInput v-model="data.token" :label="'Enter the code sent to ' + data.email" name="token"
							   type="otp"
							   @full="form?.submit()"/>
					<button :disabled="timer.value > 0" class="group"
							type="button" @click="register">
						<span
							class="font-semibold text-blue-500 group-hover:text-blue-600 group-disabled:text-gray-400 transition">Resend code</span>
						<span v-if="timer.value > 0" class="font-semibold text-gray-400"> (wait {{
								timer.value
							}}s)</span>
					</button>
				</FormContainer>
			</Transition>
		</section>
	</main>
</template>

<style scoped>
.forward-slide-fade-enter-active, .forward-slide-fade-leave-active, .backward-slide-fade-enter-active, .backward-slide-fade-leave-active {
	transition: all .3s ease-in-out;
}

.forward-slide-fade-enter, .forward-slide-fade-leave-to {
	transform: translateX(-100%);
	opacity: 0;
}

.backward-slide-fade-enter, .backward-slide-fade-leave-to {
	transform: translateX(100%);
	opacity: 0;
}
</style>