import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/index.js';

/** @type {import('./$types').Actions} */
export const actions = {
    sendMessage: async ({ request, locals, params }) => {
        const data = await request.formData();
        const messageText = data.get('messageText');
        const chatId = params.chatId;

        console.log("locals", locals)

        if (!locals.user) {
            return fail(401, { unauthorized: true });
        }

        try {
            const message = await db.sendMessage(locals.user.id, chatId, messageText);
            console.log(message)
            return { success: true, message };
        } catch (error) {
            console.log(error)
            return fail(400, { error: error.message });
        }
    }
};
