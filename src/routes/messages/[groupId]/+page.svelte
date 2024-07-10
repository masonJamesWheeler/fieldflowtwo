<script>
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';

    export let data;

    let messages = [];
    let newMessage = '';
    let intervalId;

    onMount(() => {
        loadMessages();
        intervalId = setInterval(loadMessages, 5000);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });

    async function loadMessages() {
        const response = await fetch(`/messages/${$page.params.groupId}/load`);
        messages = await response.json();
    }

    async function sendMessage() {
        if (newMessage.trim()) {
            const response = await fetch(`/messages/${$page.params.groupId}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage })
            });

            if (response.ok) {
                newMessage = '';
                await loadMessages();
            }
        }
    }
</script>

<h1>{data.chat.group_name || 'Chat'}</h1>

<div class="messages">
    {#each messages as message}
        <div class="message">
            <strong>{message.sender_name}:</strong> {message.message_text}
            <small>{new Date(message.sent_at).toLocaleString()}</small>
        </div>
    {/each}
</div>

<form on:submit|preventDefault={sendMessage}>
    <input type="text" bind:value={newMessage} placeholder="Type your message...">
    <button type="submit">Send</button>
</form>