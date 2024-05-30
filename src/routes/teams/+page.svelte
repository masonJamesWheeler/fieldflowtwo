<!-- src/routes/teams/+page.svelte -->
<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<h1>Teams</h1>

{#if data.team}
  <h2>Team: {data.team.team_name}</h2>
  <!-- Display team information here -->
{:else if data.user.role === 'coach'}
  <p>You do not have a team. <a href="/teams/create">Create a team</a></p>
{:else if data.user.role === 'player'}
  <p>You are not part of any team.</p>
{/if}
