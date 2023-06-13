// @ts-ignore
import {serverSupabaseClient} from '#supabase/server'

export default eventHandler(async (event) => {
	const client = serverSupabaseClient(event)
	const email = event.context.params?.email

	if (email === undefined) throw createError({
		statusCode: 400,
		statusMessage: 'Email invalid or missing',
	})

	const {data, error} = await client.from('profiles').select().eq('email', email).limit(1)

	if (error) {
		throw createError({
			statusCode: parseInt(error.code),
			statusMessage: error.message,
		})
	}

	return {user: data}
})
