// File: src/routes/+layout.server.js
// src/routes/+layout.server.js
import {redirect} from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {
    if (!locals.user && url.pathname !== '/auth') {
        throw redirect(302, '/auth');
    }

    return {
        user: locals.user,
        team: locals.user?.team,
        notifications: locals.user?.notifications,
        invitations: locals.user?.invitations,
    };
}