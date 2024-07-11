<!-- File: src/routes/auth/+layout.svelte --->
<!-- src/routes/auth/+layout.svelte -->
<script>
    /** @type {import('./$types').LayoutData} */
    export let data;
</script>

<nav>
    {#if data.user}
        <a href="/profile">Profile</a>
        <form method="POST" action="?/logout">
            <button type="submit">Log out</button>
        </form>
    {/if}
</nav>

<slot/>