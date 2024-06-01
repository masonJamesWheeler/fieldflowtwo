import * as db from '$lib/server/database.js';
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

    locals.user = {
        id: user.user_id,
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        role: user.role,
        team: user.team_id ? await db.getTeamById(user.team_id) : null,
    };

    return {
        user: locals.user,
    };
}
