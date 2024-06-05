<script>
    /** @type {import('./$types').PageData} */
    export let data;</script>

<h1>Profile</h1>

{#if data.user}
    <p><strong>Full Name:</strong> {data.user.fullname}</p>
    <p><strong>Email:</strong> {data.user.email}</p>
    <p><strong>Role:</strong> {data.user.role}</p>
    {#if data.user.team}
        <p><strong>Team:</strong> {data.user.team.team_name}</p>
    {/if}
{/if}