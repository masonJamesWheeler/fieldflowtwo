// File: src/lib/server/messages.js
import pool from './db.js';
import { createNotification } from './notifications.js';
import { getUserById } from './users.js';

export async function sendMessage(senderId, groupId, messageText) {
    const query = `
        INSERT INTO messages (sender_id, group_id, message_text)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [senderId, groupId, messageText]);
    return rows[0];
}

export async function getMessagesByGroupId(groupId, limit = 50) {
    const query = `
        SELECT m.message_id, m.sender_id, m.group_id, m.message_text, m.sent_at,
               u.fullname as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.user_id
        WHERE m.group_id = $1
        ORDER BY m.sent_at DESC
        LIMIT $2;
    `;
    const { rows } = await pool.query(query, [groupId, limit]);
    return rows;
}

