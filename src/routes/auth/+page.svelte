<!-- src/routes/auth/+page.svelte -->
<script>
    import {page} from '$app/stores';
</script>

<h1>Authentication</h1>

{#if !$page.url.searchParams.has('signup')}
    <h2>Login</h2>
    <form method="POST" action="?/login">
        <label>
            Email
            <input name="email" type="email" required/>
        </label>
        <label>
            Password
            <input name="password" type="password" required/>
        </label>
        <button type="submit">Log in</button>
    </form>
    <p>
        Don't have an account? <a href="?signup">Sign up</a>
    </p>
{:else}
    <h2>Sign Up</h2>
    <form method="POST" action="?/signup">
        <label>
            Full Name
            <input name="fullname" type="text" required/>
        </label>
        <label>
            Role
            <select name="role" required>
                <option value="player">Player</option>
                <option value="coach">Coach</option>
            </select>
        </label>
        <label>
            Email
            <input name="email" type="email" required/>
        </label>
        <label>
            Password
            <input name="password" type="password" required/>
        </label>
        <button type="submit">Sign up</button>
    </form>
    <p>
        Already have an account? <a href="/auth">Log in</a>
    </p>
{/if}