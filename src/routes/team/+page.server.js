// File: src/routes/team/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import * as db from '$lib/server/index.js';

/** @type {import('./$types').Actions} */
export const actions = {
    createTeam: async ({ request, locals }) => {
        const data = await request.formData();
        const teamName = data.get('teamName');

        if (!teamName) {
            return fail(400, { missing: true });
        }

        if (!locals.user) {
            return fail(401, { unauthorized: true });
        }

        if (locals.user.role !== 'coach') {
            return fail(403, { forbidden: true });
        }

        const team = await db.createTeam({
            teamName,
            coachId: locals.user.id,
        });

        throw redirect(302, `/team/${team.team_id}`);
    },
    acceptInvite: async ({ request, locals }) => {
        const data = await request.formData();
        const inviteId = data.get('inviteId');

        if (!locals.user) {
            return fail(401, { unauthorized: true });
        }

        try {
            await db.acceptTeamInvite(inviteId, locals.user.id);
        } catch (error) {
            return fail(400, { error: error.message });
        }
    },
    declineInvite: async ({ request, locals }) => {
        const data = await request.formData();
        const inviteId = data.get('inviteId');

        if (!locals.user) {
            return fail(401, { unauthorized: true });
        }

        try {
            await db.declineTeamInvite(inviteId);
        } catch (error) {
            return fail(400, { error: error.message });
        }
    }
};