// src/routes/team/message/+layout.server.js
import { redirect } from '@sveltejs/kit';
import * as db from "$lib/server/db.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
    if (!locals.user) {
        throw redirect(302, '/auth');
    }

    if (!locals.user.team) {
        console.log("User has no team, redirecting to home")
        throw redirect(302, '/');
    }

    let roster = await db.getUsersByTeamId(locals.user.team.team_id);

    // Filter out the current user from the roster
    roster = roster.filter(user => user.user_id !== locals.user.id);

    const chats = await db.getChatsByUserId(locals.user.id);

    return {
        user: locals.user,
        team: locals.user.team,
        roster: roster,
        chats: chats
    };
}
