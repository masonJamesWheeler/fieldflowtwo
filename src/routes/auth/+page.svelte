<!-- File: src/routes/auth/+page.svelte --->
<!-- src/routes/auth/+page.svelte -->
<script>
    import { enhance } from '$app/forms';
    import {page} from "$app/stores";

    export let form;
</script>

<h1>Authentication</h1>

{#if !$page.url.searchParams.has('signup')}
    <h2>Login</h2>
    <form method="POST" action="?/login" use:enhance>
        <label>
            Email
            <input name="email" type="email" required />
        </label>
        <label>
            Password
            <input name="password" type="password" required />
        </label>
        <button type="submit">Log in</button>
        {#if form?.incorrect}
            <p class="error">Incorrect email or password</p>
        {/if}
    </form>
    <p>
        Don't have an account? <a href="?signup">Sign up</a>
    </p>
{:else}
    <h2>Sign Up</h2>
    <form method="POST" action="?/signup" use:enhance>
        <label>
            Full Name
            <input name="fullname" type="text" required />
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
            <input name="email" type="email" required />
        </label>
        <label>
            Password
            <input name="password" type="password" required />
        </label>
        <button type="submit">Sign up</button>
        {#if form?.error}
            <p class="error">{form.error}</p>
        {/if}
        {#if form?.userExists}
            <p class="error">User with this email already exists</p>
        {/if}
    </form>
    <p>
        Already have an account? <a href="/auth">Log in</a>
    </p>
{/if}

<style>
    .error {
        color: red;
    }
</style>