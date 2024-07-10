// src/routes/team/message/+layout.server.js
import { redirect } from '@sveltejs/kit';
import * as db from '$lib/server/index.js';

export async function load({ locals }) {
    if (!locals.user) {
        throw redirect(302, '/auth');
    }

    if (!locals.user.team) {
        throw redirect(302, '/');
    }

    const roster = await db.getUsersByTeamId(locals.user.team.team_id);
    const chats = await db.getChatGroupsByUserId(locals.user.id);

    return {
        user: locals.user,
        team: locals.user.team,
        roster,
        chats
    };
}