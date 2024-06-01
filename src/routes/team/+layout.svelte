<!-- src/routes/team/+layout.svelte -->
<script>
    /** @type {import('./$types').LayoutData} */
    export let data;
</script>

<nav>
    {#if data.user}
        <a href="/">Home</a>
        <a href="/profile">Profile</a>
        <form method="POST" action="/auth?/logout">
            <button type="submit">Log out</button>
        </form>
    {/if}
</nav>

<slot/>
