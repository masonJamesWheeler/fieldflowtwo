// File: src/routes/messages/[groupId]/+layout.server.js
import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/index.js';

export async function load({ params, locals }) {
    if (!locals.user) {
        throw redirect(302, '/auth');
    }

    const messages = await db.getMessagesByGroupId(params.groupId);
    const chatMembers = await db.getUsersByGroupId(params.groupId);
    const chat = await db.getGroupById(params.groupId);

    return {
        user: locals.user,
        chatMembers: chatMembers,
        chat: chat,
        messages: messages
    };
}