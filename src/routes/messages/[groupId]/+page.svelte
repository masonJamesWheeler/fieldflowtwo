<!-- File: src/routes/messages/[groupId]/+page.svelte --->
<script>
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';

    export let data;
    console.log(data);

    let messages = [];
    let newMessage = '';

    async function loadMessages() {
        const response = await fetch(`?loadMessages`);
        messages = await response.json();
    }

    $: {
        if (data.messages) {
            messages = data.messages;
        }
    }
</script>

<h1>{data.chat && data.chat.group_name || 'Chat'}</h1>

<div class="messages">
    {#each messages as message}
        <div class="message">
            <strong>{message.sender_name}:</strong> {message.message_text}
            <small>{new Date(message.sent_at).toLocaleString()}</small>
        </div>
    {/each}
</div>

<form method="POST" action="?/sendMessage" use:enhance={() => {
    return async ({ result }) => {
        if (result.type === 'success') {
            newMessage = '';
            await loadMessages();
        }
    };
}}>
    <input type="text" name="message" bind:value={newMessage} placeholder="Type your message...">
    <button type="submit">Send</button>
</form>