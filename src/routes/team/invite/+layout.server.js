// src/routes/team/invite/+layout.server.js
import {error, redirect} from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals}) {
    if (!locals.user) {
        throw redirect(302, '/auth');
    }

    if (locals.user.role === 'coach' && !locals.user.team) {
        console.log("Coach has no team, redirecting to create team page")
        throw redirect(302, '/team/create');
    }

    if (locals.user.role === 'player') {
        console.log("Players cannot invite others to join the team")
        redirect(302, '/team')
    }

    return {
        user: locals.user,
        team: locals.user.team,
    };
}


