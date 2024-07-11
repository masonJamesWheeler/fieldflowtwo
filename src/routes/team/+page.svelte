<!-- File: src/routes/team/+page.svelte --->
<!-- src/routes/team/+page.svelte -->
<script>
    /** @type {import('./$types').PageData} */
    export let data;

    async function acceptInvite(inviteId) {
        const formData = new FormData();
        formData.append('inviteId', inviteId);
        await fetch('?/acceptInvite', {
            method: 'POST',
            body: formData,
        });
        location.reload();
    }

    async function declineInvite(inviteId) {
        const formData = new FormData();
        formData.append('inviteId', inviteId);
        await fetch('?/declineInvite', {
            method: 'POST',
            body: formData,
        });
        location.reload();
    }
</script>

<h1>Team</h1>

{#if data.team}
    <h2>Team: {data.team.team_name}</h2>
    <a href="/team/roster">Roster</a>
    <a href="/team/calendar">Calendar</a>
    {#if data.user.role === 'coach'}
        <a href="/team/invite">Invite</a>
    {/if}
{:else if data.user.role === 'coach'}
    <p>You do not have a team. <a href="/team/create">Create a team</a></p>
{:else if data.user.role === 'player'}
    <p>You are not part of any team.</p>
    {#if data.invitations.length > 0}
        <h2>Invitations</h2>
        <ul>
            {#each data.invitations as invitation}
                <li>
                    Team: {invitation.team_name} <br>
                    Coach: {invitation.admin_name} <br>
                    Status: {invitation.status} <br>
                    Sent: {new Date(invitation.created_at).toLocaleString()}
                    {#if invitation.status === 'pending'}
                        <button on:click={() => acceptInvite(invitation.invite_id)}>Accept</button>
                        <button on:click={() => declineInvite(invitation.invite_id)}>Decline</button>
                    {/if}
                </li>
            {/each}
        </ul>
    {:else}
        <h2>No invitations</h2>
    {/if}
{/if}
