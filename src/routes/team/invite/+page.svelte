<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    export let data;

</script>

<h1>Invite to Team</h1>

{#if data.team}
    <h2>Team: {data.team.team_name}</h2>
    <!-- Display team information here -->
    <h2>Please enter the email of the person you would like to invite to your team.</h2>
    <form method="POST" action="?/inviteUser">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <button type="submit">Invite</button>
    </form>

{:else if data.user.role === 'coach'}
    <p>You do not have a team. <a href="/teams/create">Create a team</a></p>
{:else if data.user.role === 'player'}
    <p>Only Coaches can invite other players.</p>
{/if}