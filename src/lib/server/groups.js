import pool from './db.js';

export async function findExistingGroup(memberIds, groupTypeName, teamId) {
    const query = `
        SELECT g.group_id, g.group_name, g.created_at
        FROM groups g
        JOIN group_members gm ON g.group_id = gm.group_id
        WHERE gm.user_id = ANY($1) AND g.group_type_id = (SELECT group_type_id FROM group_types WHERE group_type_name = $2) AND g.team_id = $3
        GROUP BY g.group_id, g.group_name, g.created_at
        HAVING array_agg(gm.user_id ORDER BY gm.user_id) = $1::uuid[];
    `;
    const { rows } = await pool.query(query, [memberIds.sort(), groupTypeName, teamId]);
    return rows[0] || null;
}

export async function createGroup(groupName, groupTypeName, teamId, memberIds) {
    const existingGroup = await findExistingGroup(memberIds, groupTypeName, teamId);
    if (existingGroup) {
        return { success: true, group: existingGroup };
    }

    const query = `
        INSERT INTO groups (group_name, group_type_id, team_id, created_at)
        VALUES ($1, (SELECT group_type_id FROM group_types WHERE group_type_name = $2), $3, NOW())
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [groupName, groupTypeName, teamId]);
    const group = rows[0];

    const memberInsertQuery = `
        INSERT INTO group_members (group_id, user_id)
        VALUES ($1, $2)
    `;

    for (const memberId of memberIds) {
        await pool.query(memberInsertQuery, [group.group_id, memberId]);
    }

    return { success: true, group };
}

export async function addMembersToGroup(groupId, userIds) {
    const query = 'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)';
    for (const userId of userIds) {
        await pool.query(query, [groupId, userId]);
    }
}

export async function removeMembersFromGroup(groupId, userIds) {
    const query = 'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2';
    for (const userId of userIds) {
        await pool.query(query, [groupId, userId]);
    }
}

export async function getGroupsByUserId(userId) {
    const query = `
        SELECT g.*
        FROM groups g
        JOIN group_members gm ON g.group_id = gm.group_id
        WHERE gm.user_id = $1;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
}

export async function getUsersByGroupId(groupId) {
    const query = `
        SELECT u.*
        FROM users u
        JOIN group_members gm ON u.user_id = gm.user_id
        WHERE gm.group_id = $1
    `;
    const { rows } = await pool.query(query, [groupId]);
    return rows;
}

export async function createChatGroup(groupName, teamId, memberIds) {
    const query = `
        INSERT INTO groups (group_name, group_type_id, team_id)
        VALUES ($1, (SELECT group_type_id FROM group_types WHERE group_type_name = 'chat'), $2)
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [groupName, teamId]);
    const group = rows[0];

    const memberInsertQuery = `
        INSERT INTO group_members (group_id, user_id)
        VALUES ($1, $2)
    `;

    for (const memberId of memberIds) {
        await pool.query(memberInsertQuery, [group.group_id, memberId]);
    }

    return group;
}

export async function getChatGroupsByUserId(userId) {
    const query = `
        SELECT g.*
        FROM groups g
        JOIN group_members gm ON g.group_id = gm.group_id
        JOIN group_types gt ON g.group_type_id = gt.group_type_id
        WHERE gm.user_id = $1 AND gt.group_type_name = 'chat';
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
}
