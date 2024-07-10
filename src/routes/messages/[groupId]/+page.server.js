import { json } from '@sveltejs/kit';
import * as db from '$lib/server/index.js';

export async function load({ params, locals }) {
    if (!locals.user) {
        throw redirect(302, '/auth');
    }

    const chat = await db.getGroupById(params.groupId);
    const messages = await db.getMessagesByGroupId(params.groupId);

    return {
        chat,
        messages
    };
}

export const actions = {
    loadMessages: async ({ params }) => {
        const messages = await db.getMessagesByGroupId(params.groupId);
        return json(messages);
    },

    sendMessage: async ({ request, params, locals }) => {
        const { message } = await request.json();
        await db.sendMessage(locals.user.id, params.groupId, message);
        return json({ success: true });
    }
};