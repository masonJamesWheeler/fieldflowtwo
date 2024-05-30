<script>
    import { page } from '$app/stores';
  </script>
  
  <h1>Profile</h1>
  
  {#if $page.data.user}
    <p><strong>Full Name:</strong> {$page.data.user.fullname}</p>
    <p><strong>Email:</strong> {$page.data.user.email}</p>
    <p><strong>Role:</strong> {$page.data.user.role}</p>
    {#if $page.data.user.team}
      <p><strong>Team:</strong> {$page.data.user.team.team_name}</p>
    {/if}
    <a href="/profile/edit">Edit Profile</a>
  {/if}
  