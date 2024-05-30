// src/routes/teams/+layout.server.js
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  if (!locals.user) {
    throw redirect(302, '/auth');
  }

  if (locals.user.role === 'coach' && !locals.team) {
    throw redirect(302, '/teams/create');
  }

  return {
    user: locals.user,
    team: locals.team,
  };
}


