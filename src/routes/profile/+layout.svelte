<!-- File: src/routes/profile/+layout.svelte --->
<script>
    /** @type {import('./$types').LayoutData} */
    export let data;
</script>

<nav>
    {#if data.user}
        <a href="/">Home</a>
        <form method="POST" action="/auth?/logout">
            <button type="submit">Log out</button>
        </form>
    {/if}
</nav>

<slot/>
  