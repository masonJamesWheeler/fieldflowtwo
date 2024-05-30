// src/routes/auth/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import * as db from '$lib/server/database';

/** @type {import('./$types').Actions} */
export const actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    const user = await db.getUserByEmail(email);

    if (!user) {
      return fail(400, { email, incorrect: true });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return fail(400, { email, incorrect: true });
    }

    const authenticatedUser = await db.createSession(user);
    cookies.set('session', authenticatedUser.session_id, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });

    throw redirect(302, '/');
  },

  signup: async ({ request }) => {
    const data = await request.formData();
    const fullname = data.get('fullname');
    const email = data.get('email');
    const password = data.get('password');
    const role = data.get('role');

    const existingUser = await db.getUserByEmail(email);

    if (existingUser) {
      return fail(400, { email, userExists: true });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.createUser({
      fullname,
      email,
      passwordHash: hashedPassword,
      role,
    });

    throw redirect(302, '/auth/');
  },

  logout: async ({ cookies }) => {
    const sessionId = cookies.get('session');
    if (sessionId) {
      await db.deleteSession(sessionId);
      cookies.delete('session', { path: '/' });
    }

    throw redirect(302, '/auth');
  },
};