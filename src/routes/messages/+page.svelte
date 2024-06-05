<script>
    export let data;

    let chatName = '';
    let selectedMembers = [];
</script>

<h1>Messages</h1>

<div>
    <h2>Create a Chat</h2>
    <form method="POST" action="?/createChat">
        <label for="chatName">Chat Name</label>
        <input type="text" id="chatName" name="chatName" bind:value={chatName} required>

        <label for="members">Select Members:</label>
        <select id="members" name="memberIds" multiple bind:value={selectedMembers}>
            {#each data.roster as user}
                <option value={user.user_id}>{user.fullname}</option>
            {/each}
        </select>

        <button type="submit">Create Chat</button>
    </form>
</div>

<div>
    <h2>Your Chats</h2>
    <ul>
        {#each data.chats as chat}
            <li>
                <a href={`/messages/${chat.chat_id}`}>{chat.chat_name || 'One-on-One Chat'}</a>
            </li>
        {/each}
    </ul>
</div>
