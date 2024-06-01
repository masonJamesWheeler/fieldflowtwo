// src/routes/team/invite/+page.server.js
import {fail, redirect} from '@sveltejs/kit';
import * as db from '$lib/server/database.js';

/** @type {import('./$types').Actions} */
export const actions = {
    inviteUser: async ({request, locals}) => {
        const data = await request.formData();
        const email = data.get('email');
        console.log(locals)
        const teamId = locals.user.team.team_id;

        if (!email) {
            console.log('email missing');
            return fail(400, {missing: true});
        }

        if (!locals.user) {
            console.log('user not authenticated');
            return fail(401, {unauthorized: true});
        }

        if (locals.user.role !== 'coach') {
            console.log('user not a coach');
            return fail(403, {forbidden: true});
        }

        if (!teamId) {
            console.log('teamId missing');
            return fail(400, {missing: true});
        }

        // Check to see if invited user exists
        const invitedUser = await db.getUserByEmail(email);
        if (!invitedUser) {
            console.log('user not found');
            return fail(404, {notFound: true});
        }

        // Check to see if invited user is already on a team
        if (invitedUser.team_id) {
            console.log('user already on a team');
            return fail(409, {conflict: true});
        }

        // Send invitation
        await db.inviteUserToTeam(locals.user.id, teamId, invitedUser.user_id);
    },
};
