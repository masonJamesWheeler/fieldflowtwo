import pool from './db.js';
import { createNotification } from './notifications.js';
import { getUserById } from './users.js';

export async function sendMessageToGroup(senderId, groupId, messageText) {
    const query = `
        INSERT INTO messages (sender_id, message_text, group_id, sent_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [senderId, messageText, groupId]);
    const message = rows[0];

    const membersQuery = 'SELECT user_id FROM group_members WHERE group_id = $1';
    const { rows: members } = await pool.query(membersQuery, [groupId]);

    for (const member of members) {
        if (member.user_id !== senderId) {
            const sender = await getUserById(senderId);
            await createNotification(member.user_id, 'message', message.message_id, `You have a new message from ${sender.fullname}`);
        }
    }

    return message;
}

export async function getMessagesByGroupId(groupId, limit = 50) {
    const query = 'SELECT * FROM messages WHERE group_id = $1 ORDER BY sent_at DESC LIMIT $2';
    const { rows } = await pool.query(query, [groupId, limit]);
    return rows;
}
