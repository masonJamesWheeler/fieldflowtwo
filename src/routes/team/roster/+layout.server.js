// src/routes/team/+layout.server.js
import {fail, redirect} from '@sveltejs/kit';
import * as db from "$lib/server/index.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals}) {
    if (!locals.user) {
        throw redirect(302, '/auth');
    }

    if (locals.user.role === 'coach' && !locals.user.team) {
        console.log("Coach has no team, redirecting to create team page")
        throw redirect(302, '/team/create');
    }

    if (!locals.user.team) {
        console.log("User has no team, redirecting to team page")
        throw redirect(302, '/team');
    }
    const roster = await db.getUsersByTeamId(locals.user.team.team_id);
    return {
        user: locals.user,
        team: locals.user.team,
        roster: roster
    };
}


