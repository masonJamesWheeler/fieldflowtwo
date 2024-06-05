-- Teams Table (Initial creation without admin_id reference)
CREATE TABLE teams (
    team_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    team_name character varying,
    created_at timestamp without time zone DEFAULT now()
);

-- Users Table
CREATE TABLE users (
    user_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    fullname character varying,
    email character varying UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$'),
    password_hash character varying,
    role character varying CHECK (role IN ('coach', 'player')),
    team_id uuid REFERENCES teams(team_id),
    created_at timestamp without time zone DEFAULT now()
);

-- Alter Teams Table to add admin_id reference after users table is created
ALTER TABLE teams
ADD COLUMN admin_id uuid REFERENCES users(user_id);

-- Group Types Table
CREATE TABLE group_types (
    group_type_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    group_type_name character varying UNIQUE,
    created_at timestamp without time zone DEFAULT now()
);

-- Groups Table
CREATE TABLE groups (
    group_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    group_name character varying,
    group_type_id uuid REFERENCES group_types(group_type_id),
    team_id uuid REFERENCES teams(team_id),
    created_at timestamp without time zone DEFAULT now()
);

-- Group Members Table
CREATE TABLE group_members (
    group_id uuid REFERENCES groups(group_id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, user_id)
);

-- Playbooks Table
CREATE TABLE playbooks (
    playbook_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name character varying,
    user_id uuid REFERENCES users(user_id),
    team_id uuid REFERENCES teams(team_id),
    created_at timestamp without time zone DEFAULT now()
);

-- Plays Table
CREATE TABLE plays (
    play_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES users(user_id),
    team_id uuid REFERENCES teams(team_id),
    play_name character varying,
    formation character varying,
    down_and_distance character varying,
    description text,
    diagram bytea,
    is_public boolean,
    created_at timestamp without time zone DEFAULT now()
);

-- PlaybookPlays Table
CREATE TABLE playbookplays (
    playbook_id uuid REFERENCES playbooks(playbook_id) ON DELETE CASCADE,
    play_id uuid REFERENCES plays(play_id) ON DELETE CASCADE,
    PRIMARY KEY (playbook_id, play_id)
);

-- Tags Table
CREATE TABLE tags (
    tag_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tag_name character varying,
    created_at timestamp without time zone DEFAULT now()
);

-- PlayTags Table
CREATE TABLE playtags (
    play_id uuid REFERENCES plays(play_id) ON DELETE CASCADE,
    tag_id uuid REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (play_id, tag_id)
);

-- Messages Table
CREATE TABLE messages (
    message_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id uuid REFERENCES users(user_id),
    message_text text,
    group_id uuid REFERENCES groups(group_id),
    sent_at timestamp without time zone DEFAULT now()
);

-- Sessions Table
CREATE TABLE sessions (
    session_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(user_id),
    expires_at timestamp without time zone
);

-- Installs Table
CREATE TABLE installs (
    install_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name character varying,
    playbook_id uuid REFERENCES playbooks(playbook_id),
    created_at timestamp without time zone DEFAULT now()
);

-- InstallPlays Table
CREATE TABLE installplays (
    install_id uuid REFERENCES installs(install_id) ON DELETE CASCADE,
    play_id uuid REFERENCES plays(play_id) ON DELETE CASCADE,
    PRIMARY KEY (install_id, play_id)
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    notification_type character varying,
    reference_id uuid,
    message text,
    read boolean,
    created_at timestamp without time zone DEFAULT now()
);

COMMENT ON COLUMN notifications.reference_id IS 'References the associated object (e.g., reminder, playbook, message) based on the notification_type';

-- Team Invites Table
CREATE TABLE team_invites (
    invite_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id uuid REFERENCES teams(team_id) ON DELETE CASCADE,
    coach_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    status character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

-- Events Table
CREATE TABLE events (
    event_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id uuid REFERENCES users(user_id),
    group_id uuid REFERENCES groups(group_id),
    title character varying,
    description text,
    scheduled_at timestamp without time zone,
    reminder_count integer,
    reminder_interval integer,
    reminder_unit character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

-- Recurring Events Table
CREATE TABLE recurring_events (
    recurring_event_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id uuid REFERENCES events(event_id) ON DELETE CASCADE,
    frequency character varying CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    interval integer,
    end_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);
