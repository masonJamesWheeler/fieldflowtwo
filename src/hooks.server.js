// src/hooks.server.js
import * as db from '$lib/server/index.js';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({event, resolve}) {
    const sessionId = event.cookies.get('session');
    if (sessionId) {
        const user = await db.getUserBySession(sessionId);
        if (user) {
            const team = await db.getTeamById(user.team_id);
            const notifications = await db.getNotifications(user.user_id);
            const invitations = await db.getTeamInvitesByUserId(user.user_id);

            event.locals.user = {
                id: user.user_id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                team: team || null,
                notifications: notifications || [],
                invitations: invitations || [],
            };
        } else {
            event.cookies.delete('session', {path: '/'});
        }
    }
    return resolve(event);
}