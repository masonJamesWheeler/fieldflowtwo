import pool from './db.js';
import { validateFullname, validateEmailFormat, checkEmailExists, validateRole } from './utils.js';

const allowedRoles = ['coach', 'player'];

export async function getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0] || null;
}

export async function getUserById(userId) {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const { rows } = await pool.query(query, [userId]);
    return rows[0] || null;
}

export async function createUser(user) {
    const { fullname, email, passwordHash, role } = user;

    validateFullname(fullname);
    validateEmailFormat(email);
    await checkEmailExists(email);
    validateRole(role, allowedRoles);

    const query = `
        INSERT INTO users (fullname, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [fullname, email, passwordHash, role]);
    return rows[0];
}

export async function createSession(user) {
    const query = `
        INSERT INTO sessions (user_id, session_id, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    const { rows } = await pool.query(query, [user.user_id, sessionId, expiresAt]);
    return rows[0];
}

export async function deleteSession(sessionId) {
    const query = 'DELETE FROM sessions WHERE session_id = $1';
    await pool.query
    return;
}


export async function getUserBySession(sessionId) {
    const query = `
        SELECT users.*
        FROM users
        INNER JOIN sessions ON users.user_id = sessions.user_id
        WHERE sessions.session_id = $1 AND sessions.expires_at > NOW()
    `;
    const { rows } = await pool.query(query, [sessionId]);
    return rows[0] || null;
}
