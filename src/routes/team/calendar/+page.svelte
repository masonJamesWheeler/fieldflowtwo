<!-- File: src/routes/team/calendar/+page.svelte --->
<!--/src/routes/team/calendar/+page.svelte-->
<script>
    export let data;
</script>

<h1>Calendar</h1>

{#if data.user.role === 'coach'}
    <a href="/team/calendar/create">Create Event</a>
{/if}

{#if data.events.length > 0}
    <ul>
        {#each data.events as event}
            <li>
                <strong>{event.title}</strong> <br>
                Description: {event.description} <br>
                Scheduled At: {new Date(event.scheduled_at).toLocaleString()} <br>
                {#if event.url}
                    URL: <a href={event.url} target="_blank">{event.url}</a> <br>
                {/if}
                Type: {event.type} <br>
                Reminders: {event.reminder_count} every {event.reminder_interval} {event.reminder_unit} <br>
            </li>
        {/each}
    </ul>
{:else}
    <p>No events scheduled.</p>
{/if}
