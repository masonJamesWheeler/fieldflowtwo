import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/index.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
    if (!locals.user) {
        throw redirect(302, '/auth');
    }

    const messages = await db.getMessagesByChatId(params.chatId);
    const chat = await db.getChatById(params.chatId);
    const chatMembers = await db.getUsersByChatId(params.chatId);

    return {
        user: locals.user,
        chat: chat,
        chatMembers: chatMembers,
        messages: messages
    };
}