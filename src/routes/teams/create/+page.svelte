<!-- src/routes/teams/create/+page.svelte -->
<script>
    import { page } from '$app/stores';
  </script>
  
  <h1>Create Team</h1>
  
  <form method="POST" action="?/createTeam">
    <label>
      Team Name
      <input name="teamName" type="text" required />
    </label>
    <button type="submit">Create Team</button>
  </form>
  