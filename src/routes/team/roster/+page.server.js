// src/routes/team/invite/+page.server.js
import {fail, redirect} from '@sveltejs/kit';
import * as db from '$lib/server/database.js';
import {getUsersByTeamId} from "$lib/server/database.js";

// /** @type {import('./$types').Actions} */
// export const actions = {
//     retrieveRoster: async ({request, locals}) => {
//         const teamId = locals.user.team_id;
//
//         if (!locals.user) {
//             console.log('user not authenticated');
//             return fail(401, {unauthorized: true});
//         }
//
//         if (!teamId) {
//             console.log('teamId missing');
//             return fail(400, {missing: true});
//         }
//
//         const roster = await db.getUsersByTeamId(teamId);
//         return {roster};
//     },
// };
