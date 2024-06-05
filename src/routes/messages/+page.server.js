import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/db.js';

/** @type {import('./$types').Actions} */
export const actions = {
    createChat: async ({ request, locals }) => {
        const data = await request.formData();
        const chatName = data.get('chatName');
        const memberIds = data.getAll('memberIds');

        if (!locals.user) {
            return fail(401, { unauthorized: true });
        }

        // Add the current user's ID to the member IDs
        memberIds.push(locals.user.id);

        const result = await db.createChat(chatName, memberIds);
        if (result.success) {
            throw redirect(302, `/messages/${result.chat.chat_id}`);
        } else {
            return fail(400, { error: 'Failed to create chat' });
        }
    }
};
