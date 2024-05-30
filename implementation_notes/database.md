# Football Playbook Design App Database Structure

This README provides an overview of the database structure for the Football Playbook Design app, which allows coaches to create, organize, and share plays with their teams or the public.

## Database Tables

1. **User Table:**
   - `user_id` (Primary Key)
   - `username`
   - `email`
   - `password_hash`
   - `role` (e.g., coach, player)
   - `team_id` (Foreign Key to Team table)

2. **Team Table:**
   - `team_id` (Primary Key)
   - `team_name`
   - `coach_id` (Foreign Key to User table)

3. **Play Table:**
   - `play_id` (Primary Key)
   - `name`
   - `formation`
   - `down_and_distance`
   - `description`
   - `diagram` (file path or binary data)
   - `user_id` (Foreign Key to User table)
   - `is_public` (boolean)

4. **PlayTag Table** (Many-to-Many relationship between Play and Tag):
   - `play_id` (Foreign Key to Play table)
   - `tag_id` (Foreign Key to Tag table)

5. **Tag Table:**
   - `tag_id` (Primary Key)
   - `tag_name`

6. **Playbook Table:**
   - `playbook_id` (Primary Key)
   - `name`
   - `user_id` (Foreign Key to User table)
   - `team_id` (Foreign Key to Team table)

7. **PlaybookPlay Table** (Many-to-Many relationship between Playbook and Play):
   - `playbook_id` (Foreign Key to Playbook table)
   - `play_id` (Foreign Key to Play table)

8. **Install Table:**
   - `install_id` (Primary Key)
   - `name`
   - `playbook_id` (Foreign Key to Playbook table)

9. **InstallPlay Table** (Many-to-Many relationship between Install and Play):
   - `install_id` (Foreign Key to Install table)
   - `play_id` (Foreign Key to Play table)

## Key Points

- The `User` table stores information about coaches and players, with a `role` field to differentiate between them.
- The `Team` table allows coaches to be associated with specific teams.
- The `Play` table contains standard fields for plays, such as `name`, `formation`, `down_and_distance`, and a boolean `is_public` field to control visibility.
- The `PlayTag` and `Tag` tables enable flexible tagging of plays using a many-to-many relationship.
- The `Playbook` table represents a collection of plays, associated with a user and optionally a team.
- The `PlaybookPlay` table establishes a many-to-many relationship between playbooks and plays.
- The `Install` and `InstallPlay` tables allow coaches to organize plays into specific installs within a playbook.

## Additional Considerations

- Extend and modify the database structure based on additional requirements or specific features you want to include.
- Handle data privacy and security appropriately, especially for sensitive team-specific data.
- Implement proper authentication, authorization, and access controls to maintain the privacy of plays and playbooks.

Feel free to customize and expand upon this README to include more specific details about your Football Playbook Design app's database structure and requirements.