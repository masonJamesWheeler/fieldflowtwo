import pool from './db.js';
import { createNotification } from './notifications.js';
import { getUserById } from './users.js';

export async function getTeamById(teamId) {
    const query = 'SELECT * FROM teams WHERE team_id = $1';
    const { rows } = await pool.query(query, [teamId]);
    return rows[0] || null;
}

export async function createTeam(team) {
    const { teamName, adminId } = team;
    const query = `
        INSERT INTO teams (team_name, admin_id)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [teamName, adminId]);
    return rows[0];
}

export async function updateUserTeam(userId, teamId) {
    const query = 'UPDATE users SET team_id = $1 WHERE user_id = $2';
    await pool.query(query, [teamId, userId]);
}

export async function getTeamByAdminId(adminId) {
    const query = 'SELECT * FROM teams WHERE admin_id = $1';
    const { rows } = await pool.query(query, [adminId]);
    return rows[0] || null;
}

export async function getTeamByUserId(userId) {
    const query = `
        SELECT teams.*
        FROM teams
        INNER JOIN users ON teams.team_id = users.team_id
        WHERE users.user_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows[0] || null;
}

export async function getUsersByTeamId(teamId) {
    const query = 'SELECT * FROM users WHERE team_id = $1';
    const { rows } = await pool.query(query, [teamId]);
    return rows;
}

export async function inviteUserToTeam(adminId, teamId, userId) {
    const admin = await getUserById(adminId);
    if (!admin) {
        throw new Error('Admin not found');
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
    const { rows } = await pool.query(query, [teamId, adminId, userId, 'pending', new Date(), new Date()]);

    await createNotification(userId, 'invitation', rows[0].invite_id, `You have been invited to join ${team_name.team_name} by ${admin.fullname}`);

    return rows[0];
}

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

    await createNotification(invite.admin_id, 'invitation', inviteId, `Your invitation to ${user.fullname} has been accepted.`);
}

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
    await createNotification(invite.admin_id, 'invitation', inviteId, `Your invitation to ${user.fullname} has been declined.`);
}

export async function getTeamInvitesByUserId(userId) {
    const query = `
        SELECT ti.invite_id, ti.status, ti.created_at, ti.updated_at,
               t.team_name, u.fullname AS admin_name
        FROM team_invites ti
        JOIN teams t ON ti.team_id = t.team_id
        JOIN users u ON ti.user_id = u.user_id
        WHERE ti.user_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
}
