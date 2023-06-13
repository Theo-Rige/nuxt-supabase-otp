<script lang="ts" setup>
const user = useSupabaseUser()
const {auth} = useSupabaseAuthClient()
</script>

<template>
	<header class="h-20 flex justify-end items-center gap-10 px-20">
		<NuxtLink class="mr-auto" to="/">My App</NuxtLink>
		<template v-if="user">
			Welcome {{ user?.user_metadata.full_name }} !
			<FormButton @click="auth.signOut()">Logout</FormButton>
		</template>
		<template v-else>
			<NuxtLink class="font-semibold text-blue-500 hover:text-blue-600 transition" to="/auth">Login</NuxtLink>
			<NuxtLink class="font-semibold text-blue-500 hover:text-blue-600 transition" to="/auth">Register</NuxtLink>
		</template>
	</header>
</template>