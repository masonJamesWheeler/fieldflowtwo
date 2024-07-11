<!-- File: src/routes/team/calendar/create/+page.svelte --->
<!-- src/routes/team/calendar/create/+page.svelte -->
<script>
    export let data;

    let title = '';
    let description = '';
    let url = '';
    let scheduled_at = '';
    let reminder_count = 0;
    let reminder_interval = 0;
    let reminder_unit = '';
    let content = '';
    let selectedMembers = [];
    let frequency = '';
    let interval = 1;
    let end_date = '';
</script>

{#if data.user.role === 'coach'}
    <h2>Create Event</h2>
    <form method="POST" action="?/createEvent">
        <label>Title: <input type="text" name="title" bind:value={title} required /></label>
        <label>Description: <textarea name="description" bind:value={description} required></textarea></label>
        <label>URL: <input type="text" name="url" bind:value={url} /></label>
        <label>Scheduled At: <input type="datetime-local" name="scheduled_at" bind:value={scheduled_at} required /></label>
        <label>Reminder Count: <input type="number" name="reminder_count" bind:value={reminder_count} required /></label>
        <label>Reminder Interval: <input type="number" name="reminder_interval" bind:value={reminder_interval} required /></label>
        <label>Reminder Unit: <input type="text" name="reminder_unit" bind:value={reminder_unit} required /></label>
        <label>Content: <textarea name="content" bind:value={content}></textarea></label>
        <label>Select Members:
            <select multiple name="memberIds" bind:value={selectedMembers}>
                {#each data.roster as user}
                    <option value={user.user_id}>{user.fullname}</option>
                {/each}
            </select>
        </label>
        <label>Recurring Event:
            <select name="frequency" bind:value={frequency}>
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
        </label>
        {#if frequency}
            <label>Interval: <input type="number" name="interval" bind:value={interval} required /></label>
            <label>End Date: <input type="date" name="end_date" bind:value={end_date} required /></label>
        {/if}
        <button type="submit">Create Event</button>
    </form>
{/if}
