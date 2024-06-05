import pool from './db.js';

async function getAllowedNotificationTypes() {
    return ['play', 'playbook', 'install', 'message', 'invitation', 'reminder'];
}

export async function createNotification(userId, type, referenceId, message) {
    const allowedTypes = await getAllowedNotificationTypes();

    if (!allowedTypes.includes(type)) {
        throw new Error(`Invalid notification type: ${type}`);
    }

    const query = `
        INSERT INTO notifications (user_id, notification_type, reference_id, message, read, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(query, [userId, type, referenceId, message, false, new Date()]);
}

export async function getNotifications(userId, limit = 10) {
    const query = 'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2';
    const { rows } = await pool.query(query, [userId, limit]);
    return rows;
}

export async function markNotificationAsRead(notificationId) {
    const query = 'UPDATE notifications SET read = true WHERE notification_id = $1';
    await pool.query(query, [notificationId]);
}
