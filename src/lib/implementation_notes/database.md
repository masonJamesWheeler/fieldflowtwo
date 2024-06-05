### Database Schema

#### Table: `chat_members`
- `chat_id` (uuid)
- `user_id` (uuid)
- `is_muted` (boolean)

#### Table: `chats`
- `chat_id` (uuid)
- `chat_name` (character varying)
- `created_at` (timestamp without time zone)

#### Table: `installplays`
- `install_id` (uuid)
- `play_id` (uuid)

#### Table: `installs`
- `install_id` (uuid)
- `name` (character varying)
- `playbook_id` (uuid)
- `created_at` (timestamp without time zone)

#### Table: `messages`
- `message_id` (uuid)
- `sender_id` (uuid)
- `message_text` (text)
- `play_id` (uuid)
- `playbook_id` (uuid)
- `install_id` (uuid)
- `sent_at` (timestamp without time zone)
- `chat_id` (uuid)

#### Table: `notifications`
- `notification_id` (uuid)
- `user_id` (uuid)
- `notification_type` (character varying)
- `reference_id` (uuid)
- `message` (text)
- `read` (boolean)
- `created_at` (timestamp without time zone)

#### Table: `playbookplays`
- `playbook_id` (uuid)
- `play_id` (uuid)

#### Table: `playbooks`
- `playbook_id` (uuid)
- `name` (character varying)
- `user_id` (uuid)
- `team_id` (uuid)
- `created_at` (timestamp without time zone)

#### Table: `plays`
- `play_id` (uuid)
- `user_id` (uuid)
- `team_id` (uuid)
- `play_name` (character varying)
- `formation` (character varying)
- `down_and_distance` (character varying)
- `description` (text)
- `diagram` (bytea)
- `is_public` (boolean)
- `created_at` (timestamp without time zone)

#### Table: `playtags`
- `play_id` (uuid)
- `tag_id` (uuid)

#### Table: `sessions`
- `session_id` (uuid)
- `user_id` (uuid)
- `expires_at` (timestamp without time zone)

#### Table: `tags`
- `tag_id` (uuid)
- `tag_name` (character varying)
- `created_at` (timestamp without time zone)

#### Table: `team_invites`
- `invite_id` (uuid)
- `team_id` (uuid)
- `coach_id` (uuid)
- `user_id` (uuid)
- `status` (character varying)
- `created_at` (timestamp without time zone)
- `updated_at` (timestamp without time zone)

#### Table: `teams`
- `team_id` (uuid)
- `team_name` (character varying)
- `coach_id` (uuid)
- `created_at` (timestamp without time zone)

#### Table: `users`
- `user_id` (uuid)
- `fullname` (character varying)
- `email` (character varying)
- `password_hash` (character varying)
- `role` (character varying)
- `team_id` (uuid)
- `created_at` (timestamp without time zone)

