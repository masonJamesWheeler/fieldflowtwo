// src/lib/server/database.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: "wheels",
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
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

/**
 * Creates a new user in the database.
 * @param {object} user - The user object containing fullname, email, passwordHash, and role.
 * @returns {Promise<object>} A promise that resolves to the created user object.
 */
export async function createUser(user) {
  const { fullname, email, passwordHash, role } = user;
  const query = `
    INSERT INTO Users (fullname, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [fullname, email, passwordHash, role]);
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
  const { rows } = await pool.query(query, [user.user_id, sessionId, expiresAt]);
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
  const { rows } = await pool.query(query, [sessionId]);
  return rows[0] || null;
}

/**
 * Retrieves a team from the database by team ID.
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<object|null>} A promise that resolves to the team object or null if not found.
 */
export async function getTeamById(teamId) {
  const query = 'SELECT * FROM Teams WHERE team_id = $1';
  const { rows } = await pool.query(query, [teamId]);
  return rows[0] || null;
}

/**
 * Creates a new team in the database.
 * @param {object} team - The team object containing teamName and coachId.
 * @returns {Promise<object>} A promise that resolves to the created team object.
 */
export async function createTeam(team) {
  const { teamName, coachId } = team;
  const query = `
    INSERT INTO Teams (team_name, coach_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [teamName, coachId]);
  return rows[0];
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
  const { rows } = await pool.query(query, [coachId]);
  return rows[0] || null;
}

/**
 * Retrieves a team from the database by player ID.
 * @param {string} playerId - The ID of the player.
 * @returns {Promise<object|null>} A promise that resolves to the team object or null if not found.
 */
export async function getTeamByPlayerId(playerId) {
  const query = `
    SELECT Teams.*
    FROM Teams
    INNER JOIN Users ON Teams.team_id = Users.team_id
    WHERE Users.user_id = $1
  `;
  const { rows } = await pool.query(query, [playerId]);
  return rows[0] || null;
}
  