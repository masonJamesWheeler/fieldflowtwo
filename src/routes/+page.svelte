<!-- File: src/routes/+page.svelte --->
<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    export let data;

</script>

<a href="auth">sign up or login</a>
<a href="profile">profile</a>
<a href="team">team</a>
<a href="messages">messages</a>
<a href="drawplay">drawplay</a>

{#if data.notifications.length > 0}
    <h2>Notifications</h2>
    <ul>
        {#each data.notifications as notification}
            <li>
                {notification.message}
            </li>
        {/each}
    </ul>
{:else}
    <h2>No notifications</h2>
{/if}

