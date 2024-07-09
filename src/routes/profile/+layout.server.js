import * as db from '$lib/server/index.js';
import {redirect} from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({cookies, locals}) {
    const sessionId = cookies.get('session');

    if (!sessionId) {
        throw redirect(302, '/auth');
    }

    const user = await db.getUserBySession(sessionId);

    if (!user) {
        cookies.delete('session');
        throw redirect(302, '/auth');
    }

    return {
        user: locals.user,
        team: locals.user.team,
        invitations: locals.user.invitations,
    };

}
