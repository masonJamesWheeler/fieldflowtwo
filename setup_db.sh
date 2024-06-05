#!/bin/bash

# Define the database name and schema file
DB_NAME="fieldflow"
SCHEMA_FILE="schema.sql"

# Check if PostgreSQL is installed
if ! command -v psql > /dev/null; then
  echo "PostgreSQL is not installed. Please install it using Homebrew with 'brew install postgresql@14'"
  exit 1
fi

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
brew services start postgresql@14

# Wait a few seconds to ensure the service starts
sleep 5

# Check if the database already exists
if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
  echo "Database '$DB_NAME' already exists. Dropping it first..."
  dropdb $DB_NAME
fi

# Create the database
echo "Creating database '$DB_NAME'..."
createdb $DB_NAME

# Apply the schema
echo "Applying schema from '$SCHEMA_FILE'..."
psql -d $DB_NAME -f $SCHEMA_FILE

echo "Database setup complete."
