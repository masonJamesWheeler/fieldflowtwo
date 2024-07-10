import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/index.js';

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

        try {
            const chat = await db.createChatGroup(chatName, locals.user.team.team_id, memberIds);
            throw redirect(302, `/messages/${chat.group_id}`);
        } catch (error) {
            return fail(400, { error: 'Failed to create chat' });
        }
    }
};