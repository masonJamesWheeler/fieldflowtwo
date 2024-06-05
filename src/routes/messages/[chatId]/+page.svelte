<script>
    /** @type {import('./$types').PageData} */
    export let data;

    // Create a mapping of user IDs to full names
    let userIdToFullName = {};
    data.chatMembers.forEach(member => {
        userIdToFullName[member.user_id] = member.fullname;
    });

</script>

<h1>{data.chat.chat_name || 'Chat'}</h1>

<h2>Members</h2>
<ul>
    {#each data.chatMembers as member}
        <li>{member.fullname}</li>
    {/each}
</ul>

<h2>Messages</h2>

<div>
    <ul>
        {#each data.messages as message}
            <li>{userIdToFullName[message.sender_id] || message.sender_id}: {message.message_text} - {new Date(message.sent_at).toLocaleString()}</li>
        {/each}
    </ul>
</div>

<div>
    <form method="POST" action="?/sendMessage">
        <textarea name="messageText" placeholder="Type your message" required></textarea>
        <input type="hidden" name="chatId" value={data.chat.chat_id} />
        <button type="submit">Send</button>
    </form>
</div>
