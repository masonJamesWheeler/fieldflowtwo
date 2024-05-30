<!-- src/routes/teams/[id]/+page.svelte -->
<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<h1>Team Details</h1>

{#if data.team}
  <p><strong>Team Name:</strong> {data.team.team_name}</p>
  <p><strong>Coach ID:</strong> {data.team.coach_id}</p>

  <h2>Players</h2>
  {#if data.players.length > 0}
    <ul>
      {#each data.players as player}
        <li>{player.fullname} - {player.email}</li>
      {/each}
    </ul>
  {:else}
    <p>No players found for this team.</p>
  {/if}
{/if}
