// File: src/routes/team/calendar/create/+layout.server.js
// src/routes/team/calendar/create/+layout.server.js
import * as db from '$lib/server/index.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    if (!locals.user) {
        throw redirect(302, '/auth');
    }

    const team = await db.getTeamById(locals.user.team.team_id);
    const roster = await db.getUsersByTeamId(locals.user.team.team_id);

    return {
        user: locals.user,
        team: team,
        roster: roster
    };
}