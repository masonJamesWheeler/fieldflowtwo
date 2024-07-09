// src/routes/team/+layout.server.js
import {redirect} from '@sveltejs/kit';
import {page} from "$app/stores";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({locals, url}) {
    if (!locals.user) {
        console.log('redirecting to /auth');
        throw redirect(302, '/auth');
    }

    if (locals.user.role === 'coach' && !locals.user.team && url.pathname !== '/team/create') {
        throw redirect(302, '/team/create');
    }

    return {
        user: locals.user,
        team: locals.user.team,
        invitations: locals.user.invitations,
    };
}


