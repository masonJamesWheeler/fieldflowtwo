// File: src/lib/server/events.js
import pool from './db.js';

export async function createEventForGroup(event, groupId, recurrence = null) {
    const {
        creator_id,
        title,
        description,
        scheduled_at,
        reminder_count,
        reminder_interval,
        reminder_unit
    } = event;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const query = `
            INSERT INTO events (creator_id, group_id, title, description, scheduled_at, reminder_count, reminder_interval, reminder_unit, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            RETURNING *;
        `;
        const { rows } = await client.query(query, [creator_id, groupId, title, description, scheduled_at, reminder_count, reminder_interval, reminder_unit]);
        const createdEvent = rows[0];

        if (recurrence) {
            const recurrenceQuery = `
                INSERT INTO recurring_events (event_id, frequency, interval, end_date, created_at)
                VALUES ($1, $2, $3, $4, NOW())
                RETURNING *;
            `;
            await client.query(recurrenceQuery, [createdEvent.event_id, recurrence.frequency, recurrence.interval, recurrence.end_date]);
        }

        await client.query('COMMIT');
        return createdEvent;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function generateRecurringEvents() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const recurrenceQuery = `
            SELECT re.*, e.creator_id, e.group_id, e.title, e.description, e.scheduled_at
            FROM recurring_events re
            JOIN events e ON re.event_id = e.event_id
        `;
        const { rows: recurrences } = await client.query(recurrenceQuery);

        for (const recurrence of recurrences) {
            let nextEventTime = new Date(recurrence.scheduled_at);
            while (nextEventTime <= (recurrence.end_date || new Date())) {
                if (nextEventTime !== new Date(recurrence.scheduled_at)) {
                    const eventQuery = `
                        INSERT INTO events (creator_id, group_id, title, description, scheduled_at, created_at, updated_at)
                        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                        RETURNING *;
                    `;
                    const { rows } = await client.query(eventQuery, [recurrence.creator_id, recurrence.group_id, recurrence.title, recurrence.description, nextEventTime]);
                    const newEvent = rows[0];
                }

                if (recurrence.frequency === 'daily') {
                    nextEventTime.setDate(nextEventTime.getDate() + recurrence.interval);
                } else if (recurrence.frequency === 'weekly') {
                    nextEventTime.setDate(nextEventTime.getDate() + 7 * recurrence.interval);
                } else if (recurrence.frequency === 'monthly') {
                    nextEventTime.setMonth(nextEventTime.getMonth() + recurrence.interval);
                }
            }
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}