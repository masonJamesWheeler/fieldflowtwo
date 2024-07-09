// src/routes/team/calendar/+page.server.js
import { redirect } from '@sveltejs/kit';
import * as db from '$lib/server/index.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    if (!locals.user) {
        throw redirect(302, '/auth');
    }

    const events = await db.getEventsByUserId(locals.user.id);

    return {
        user: locals.user,
        team: locals.user.team,
        events: events
    };
}





