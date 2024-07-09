// src/routes/team/create/+page.server.js
import {fail, redirect} from '@sveltejs/kit';
import * as db from '$lib/server/index.js';

/** @type {import('./$types').Actions} */
export const actions = {
    createTeam: async ({request, locals}) => {
        const data = await request.formData();
        const teamName = data.get('teamName');

        if (!teamName) {
            console.log('teamName missing');
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

        const team = await db.createTeam({
            teamName,
            coachId: locals.user.id,
        });

        // Update user's team_id
        await db.updateUserTeam(locals.user.id, team.team_id);
        redirect(302, `/team`);
    },
};
