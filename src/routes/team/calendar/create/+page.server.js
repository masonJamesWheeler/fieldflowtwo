// src/routes/team/calendar/create/+page.server.js
import { fail } from '@sveltejs/kit';
import * as db from '$lib/server/db.js';

/** @type {import('./$types').Actions} */
export const actions = {
    createEvent: async ({ request, locals }) => {
        const data = await request.formData();
        const event = {
            creator_id: locals.user.id,
            title: data.get('title'),
            description: data.get('description'),
            url: data.get('url'),
            scheduled_at: data.get('scheduled_at'),
            reminder_count: data.get('reminder_count'),
            reminder_interval: data.get('reminder_interval'),
            reminder_unit: data.get('reminder_unit'),
            content: data.get('content')
        };
        const memberIds = data.getAll('memberIds');
        const recurring = {
            frequency: data.get('frequency'),
            interval: data.get('interval'),
            end_date: data.get('end_date')
        };

        try {
            await db.createEvent(event, memberIds, recurring);
            return { success: true };
        } catch (error) {
            console.error('Error creating event:', error);
            return fail(400, { error: 'Error creating event' });
        }
    }
};