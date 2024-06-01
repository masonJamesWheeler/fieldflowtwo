// src/routes/team/+layout.server.js
import {redirect} from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals}) {
    if (!locals.user) {
        throw redirect(302, '/auth');
    }

    if (locals.user.role === 'coach' && !locals.user.team) {
        console.log("redirecting in create")
        throw redirect(302, '/teams/create');
    }

    return {
        user: locals.user,
        team: locals.user.team,
        invitations: locals.user.invitations,
    };
}


