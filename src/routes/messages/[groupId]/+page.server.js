// File: src/routes/messages/[groupId]/+page.server.js
import { json } from '@sveltejs/kit';
import * as db from '$lib/server/index.js';


export const actions = {
    loadMessages: async ({request, params,  }) => {
        const messages = await db.getMessagesByGroupId(params.groupId);
        return { messages };
    },
    sendMessage: async ({ request, params, locals }) => {
        const data = await request.formData();
        const message = data.get('message');

        if (!message || message.trim() === '') {
            return fail(400, { message, error: 'Message cannot be empty' });
        }

        try {
            await db.sendMessage(locals.user.id, params.groupId, message);
            const messages = await db.getMessagesByGroupId(params.groupId);
            return { success: true, messages };
        } catch (error) {
            console.error('Error sending message:', error);
            return fail(500, { message, error: 'Failed to send message' });
        }
    }
};