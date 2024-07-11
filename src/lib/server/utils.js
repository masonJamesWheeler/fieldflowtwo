// File: src/lib/server/utils.js
import pool from './db.js';

export function validateFullname(fullname) {
    if (typeof fullname !== 'string' || fullname.trim().length === 0) {
        throw new Error('Invalid fullname. Fullname must be a non-empty string.');
    }
}

export function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format.');
    }
}

export async function checkEmailExists(email) {
    const query = 'SELECT COUNT(*) FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    if (rows[0].count > 0) {
        throw new Error('Email already exists.');
    }
}

export function validateRole(role, allowedRoles) {
    if (!allowedRoles.includes(role)) {
        throw new Error(`Invalid role. Role must be one of: ${allowedRoles.join(', ')}.`);
    }
}
