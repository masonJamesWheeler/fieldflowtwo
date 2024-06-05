// src/routes/auth/+layout.server.js
import * as db from '$lib/server/db.js';
import {redirect} from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({cookies, locals, url}) {
    const sessionId = cookies.get('session');

    if (sessionId) {
        const user = await db.getUserBySession(sessionId);

        if (user) {
            locals.user = {
                id: user.user_id,
                email: user.email,
                username: user.username,
                role: user.role,
            };

            // Redirect to /profile if user is authenticated and trying to access /auth
            if (url.pathname === '/auth') {
                throw redirect(302, '/profile');
            }
        }
    }

    if (url.pathname === '/auth' && url.searchParams.has('logout')) {
        cookies.delete('session');
        locals.user = null;
    }

    return {
        user: locals.user,
    };
}
