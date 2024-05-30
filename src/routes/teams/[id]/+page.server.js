// src/routes/teams/[id]/+page.server.js
import { fail } from '@sveltejs/kit';
import * as db from '$lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
  if (!locals.user) {
    throw redirect(302, '/auth');
  }

  const team = await db.getTeamById(params.id);

  if (!team) {
    return fail(404, { message: 'Team not found' });
  }

  // Check if the user is the coach of the team or a player in the team
  if ((locals.user.role === 'coach' && team.coach_id !== locals.user.id) ||
      (locals.user.role === 'player' && team.team_id !== locals.user.team_id)) {
    throw redirect(302, '/');
  }

  const players = await db.getPlayersByTeamId(team.team_id);

  return {
    user: locals.user,
    team,
    players
  };
}
