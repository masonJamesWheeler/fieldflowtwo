<script>
export let data;
</script>

<h2>Roster</h2>

{#if data.roster.length > 0}
    <ul>
        {#each data.roster as player}
            <li>
                <strong>{player.fullname}</strong> <br>
                Email: {player.email} <br>
                Role: {player.role}
            </li>
        {/each}
    </ul>
{:else}
    <p>No players on the roster</p>
{/if}