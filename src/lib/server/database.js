// src/lib/server/database.js
import pkg from 'pg';

const {Pool} = pkg;

const pool = new Pool({
    user: "masewheeler",
    password: "Brewen12!!",
    host: "localhost",
    port: 5432,
    database: "fieldflow",
});

/**
 * Retrieves a user from the database by email.
 * @param {string} email - The email of the user.
 * @returns {Promise<object|null>} A promise that resolves to the user object or null if not found.
 */
export async function getUserByEmail(email) {
    const query = 'SELECT * FROM Users WHERE email = $1';
    const {rows} = await pool.query(query, [email]);
    return rows[0] || null;
}

/**
 * Retrieves a user from the database by ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object|null>} A promise that resolves to the user object or null if not found.
 */
export async function getUserById(userId) {
    const query = 'SELECT * FROM Users WHERE user_id = $1';
    const {rows} = await pool.query(query, [userId]);
    return rows[0] || null;
}

/**
 * Creates a new user in the database.
 * @param {object} user - The user object containing fullname, email, passwordHash, and role.
 * @returns {Promise<object>} A promise that resolves to the created user object.
 */
export async function createUser(user) {
    const {fullname, email, passwordHash, role} = user;
    const query = `
    INSERT INTO Users (fullname, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
    const {rows} = await pool.query(query, [fullname, email, passwordHash, role]);
    return rows[0];
}

/**
 * Creates a new session for the authenticated user.
 * @param {object} user - The authenticated user object.
 * @returns {Promise<object>} A promise that resolves to the created session object.
 */
export async function createSession(user) {
    const query = `
    INSERT INTO Sessions (user_id, session_id, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    const {rows} = await pool.query(query, [user.user_id, sessionId, expiresAt]);
    return rows[0];
}

/**
 * Retrieves a user from the database by session ID.
 * @param {string} sessionId - The session ID.
 * @returns {Promise<object|null>} A promise that resolves to the user object or null if not found or session expired.
 */
export async function getUserBySession(sessionId) {
    const query = `
    SELECT Users.*
    FROM Users
    INNER JOIN Sessions ON Users.user_id = Sessions.user_id
    WHERE Sessions.session_id = $1 AND Sessions.expires_at > NOW()
  `;
    const {rows} = await pool.query(query, [sessionId]);
    return rows[0] || null;
}

/**
 * Retrieves a team from the database by team ID.
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<object|null>} A promise that resolves to the team object or null if not found.
 */
export async function getTeamById(teamId) {
    const query = 'SELECT * FROM Teams WHERE team_id = $1';
    const {rows} = await pool.query(query, [teamId]);
    return rows[0] || null;
}

/**
 * Creates a new team in the database.
 * @param {object} team - The team object containing teamName and coachId.
 * @returns {Promise<object>} A promise that resolves to the created team object.
 */
export async function createTeam(team) {
    const {teamName, coachId} = team;
    const query = `
    INSERT INTO Teams (team_name, coach_id)
    VALUES ($1, $2)
    RETURNING *
  `;
    const {rows} = await pool.query(query, [teamName, coachId]);
    return rows[0];
}

/**
 * Updates a user's team ID in the database.
 * @param {string} userId - The ID of the user.
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<void>} A promise that resolves when the user's team ID is updated.
 */
export async function updateUserTeam(userId, teamId) {
    const query = 'UPDATE Users SET team_id = $1 WHERE user_id = $2';
    await pool.query(query, [teamId, userId]);
}


/**
 * Deletes a session from the database by session ID.
 * @param {string} sessionId - The session ID.
 * @returns {Promise<void>} A promise that resolves when the session is deleted.
 */
export async function deleteSession(sessionId) {
    const query = 'DELETE FROM Sessions WHERE session_id = $1';
    await pool.query(query, [sessionId]);
}

/**
 * Retrieves a team from the database by coach ID.
 * @param {string} coachId - The ID of the coach.
 * @returns {Promise<object|null>} A promise that resolves to the team object or null if not found.
 */
export async function getTeamByCoachId(coachId) {
    const query = 'SELECT * FROM Teams WHERE coach_id = $1';
    const {rows} = await pool.query(query, [coachId]);
    return rows[0] || null;
}

/**
 * Retrieves a team from the database by user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object|null>} A promise that resolves to the team object or null if not found.
 */
export async function getTeamByUserId(userId) {
    const query = `
    SELECT Teams.*
    FROM Teams
    INNER JOIN Users ON Teams.team_id = Users.team_id
    WHERE Users.user_id = $1
  `;
    const {rows} = await pool.query(query, [userId]);
    return rows[0] || null;
}

/**
 * Retrieves all users on a team.
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<object[]>} A promise that resolves to an array of user objects.
 */
export async function getUsersByTeamId(teamId) {
    const query = 'SELECT * FROM Users WHERE team_id = $1';
    const {rows} = await pool.query(query, [teamId]);
    return rows;
}

////////////////////////////////////////////////////////
// Functions for accepting and rejecting team invites
////////////////////////////////////////////////////////
/**
 * Invites a user to a team.
 * @param {string} coachId - The ID of the coach.
 * @param {string} teamId - The ID of the team.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} A promise that resolves to the created invite object.
 */
export async function inviteUserToTeam(coachId, teamId, userId) {
    const coach = await getUserById(coachId);
    if (!coach) {
        throw new Error('Coach not found');
    }

    const user = await getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (user.team_id) {
        throw new Error('User is already on a team');
    }

    const team_name = await getTeamById(teamId);

    const query = `
        INSERT INTO team_invites (team_id, coach_id, user_id, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const { rows } = await pool.query(query, [teamId, coachId, userId, 'pending', new Date(), new Date()]);


    await createNotification(userId, 'invitation', rows[0].invite_id, `You have been invited to join ${team_name.team_name} by ${coach.fullname}`);

    return rows[0];
}

/**
 * Accepts a team invite for a user.
 * @param {string} inviteId - The ID of the invite.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<void>} A promise that resolves when the invite is accepted.
 */
export async function acceptTeamInvite(inviteId, userId) {
    const query = 'SELECT * FROM team_invites WHERE invite_id = $1 AND status = $2';
    const { rows } = await pool.query(query, [inviteId, 'pending']);
    const invite = rows[0];
    if (!invite) {
        throw new Error('Invite not found or already processed');
    }

    const user = await getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (user.team_id) {
        throw new Error('User is already on a team');
    }

    const updateInviteQuery = 'UPDATE team_invites SET status = $1, updated_at = $2 WHERE invite_id = $3';
    await pool.query(updateInviteQuery, ['accepted', new Date(), inviteId]);

    const updateUserQuery = 'UPDATE users SET team_id = $1 WHERE user_id = $2';
    await pool.query(updateUserQuery, [invite.team_id, userId]);

    await createNotification(invite.coach_id, 'invitation', inviteId, `Your invitation to ${user.fullname} has been accepted.`);
}

/**
 * Declines a team invite for a user.
 * @param {string} inviteId - The ID of the invite.
 * @returns {Promise<void>} A promise that resolves when the invite is declined.
 */
export async function declineTeamInvite(inviteId) {
    const query = 'SELECT * FROM team_invites WHERE invite_id = $1 AND status = $2';
    const { rows } = await pool.query(query, [inviteId, 'pending']);
    const invite = rows[0];
    if (!invite) {
        throw new Error('Invite not found or already processed');
    }

    const updateQuery = 'UPDATE team_invites SET status = $1, updated_at = $2 WHERE invite_id = $3';
    await pool.query(updateQuery, ['declined', new Date(), inviteId]);

    const user = await getUserById(invite.user_id);
    await createNotification(invite.coach_id, 'invitation', inviteId, `Your invitation to ${user.fullname} has been declined.`);
}

/**
 * Retrieves team invites for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object[]>} A promise that resolves to an array of invite objects.
 */
export async function getTeamInvitesByUserId(userId) {
    const query = `
        SELECT ti.invite_id, ti.status, ti.created_at, ti.updated_at,
               t.team_name, u.fullname AS coach_name
        FROM team_invites ti
        JOIN Teams t ON ti.team_id = t.team_id
        JOIN Users u ON ti.coach_id = u.user_id
        WHERE ti.user_id = $1
    `;
    const {rows} = await pool.query(query, [userId]);
    return rows;
}

/**
 * Sends a message to a chat.
 * @param {string} senderId - The ID of the sender.
 * @param {string} chatId - The ID of the chat.
 * @param {string} messageText - The text of the message.
 * @param {string} contentId - The ID of the content (play, playbook, or install), if any.
 * @param {string} contentType - The type of content ('play', 'playbook', 'install'), if any.
 * @returns {Promise<object>} A promise that resolves to the created message object.
 */
export async function sendMessage(senderId, chatId, messageText, contentId = null, contentType = null) {
    const sender = await getUserById(senderId);
    if (!sender) {
        throw new Error('Sender not found');
    }

    const columns = ['sender_id', 'chat_id', 'message_text', 'sent_at'];
    const values = [senderId, chatId, messageText, new Date()];

    if (contentType === 'play') {
        columns.push('play_id');
        values.push(contentId);
    } else if (contentType === 'playbook') {
        columns.push('playbook_id');
        values.push(contentId);
    } else if (contentType === 'install') {
        columns.push('install_id');
        values.push(contentId);
    } else if (contentType) {
        throw new Error('Invalid content type');
    }

    const query = `
        INSERT INTO messages (${columns.join(', ')})
        VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')})
        RETURNING *;
    `;
    const { rows } = await pool.query(query, values);
    const message = rows[0];

    // Get chat members to create notifications
    const membersQuery = 'SELECT user_id FROM chat_members WHERE chat_id = $1';
    const { rows: members } = await pool.query(membersQuery, [chatId]);

    for (const member of members) {
        if (member.user_id !== senderId) {
            await createNotification(member.user_id, contentType || 'message', message.message_id, `You have a new message from ${sender.fullname}`);
        }
    }

    return message;
}

/**
 * Retrieves messages for a chat.
 * @param {string} chatId - The ID of the chat.
 * @param {number} limit - The maximum number of messages to retrieve.
 * @returns {Promise<object[]>} A promise that resolves to an array of message objects.
 */
export async function getMessagesByChatId(chatId, limit = 50) {
    const query = 'SELECT * FROM messages WHERE chat_id = $1 ORDER BY sent_at DESC LIMIT $2';
    const { rows } = await pool.query(query, [chatId, limit]);
    return rows;
}

/**
 * Creates a new chat.
 * @param {string} chatName - The name of the chat (null for one-on-one chats).
 * @param {string[]} memberIds - The IDs of the chat members.
 * @returns {Promise<object>} A promise that resolves to the created chat object.
 */
export async function createChat(chatName, memberIds) {
    const query = `
        INSERT INTO chats (chat_name, created_at)
        VALUES ($1, CURRENT_TIMESTAMP)
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [chatName]);
    const chat = rows[0];

    const memberInsertQuery = `
        INSERT INTO chat_members (chat_id, user_id, is_muted)
        VALUES ($1, $2, $3)
    `;

    for (const memberId of memberIds) {
        await pool.query(memberInsertQuery, [chat.chat_id, memberId, false]);
    }

    return chat;
}

/**
 * Retrieves allowed Notification types.
 * @returns {Promise<string[]>}
 */
async function getAllowedNotificationTypes() {
    // Since the allowed types are now expanded, you can directly return the array
    return ['play', 'playbook', 'install', 'message', 'invitation'];
}

/**
 * Creates a notification for a user.
 * @param {string} userId - The ID of the user.
 * @param {string} type - The type of content ('play', 'playbook', 'install').
 * @param {string} referenceId - The ID of the referenced content.
 * @param {string} message - The notification message.
 * @returns {Promise<void>} A promise that resolves when the notification is created.
 */
async function createNotification(userId, type, referenceId, message) {
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

/**
 * Retrieves notifications for a user.
 * @param {string} userId - The ID of the user.
 * @param {number} limit - The maximum number of notifications to retrieve.
 * @returns {Promise<object[]>} A promise that resolves to an array of notification objects.
 */
export async function getNotifications(userId, limit = 10) {
    const query = 'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2';
    const {rows} = await pool.query(query, [userId, limit]);
    return rows;
}

/**
 * Marks a notification as read.
 * @param {string} notificationId - The ID of the notification.
 * @returns {Promise<void>} A promise that resolves when the notification is marked as read.
 */
export async function markNotificationAsRead(notificationId) {
    const query = 'UPDATE notifications SET read = true WHERE notification_id = $1';
    await pool.query(query, [notificationId]);
}