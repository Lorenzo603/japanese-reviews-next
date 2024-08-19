#!/bin/bash

read -s -p "Enter the password: " password
echo

SCRIPTS_DIR=$( dirname -- "$0"; )
echo "Scripts Dir:" $SCRIPTS_DIR

# Load configuration
source $SCRIPTS_DIR/scripts-config.txt

# excluded_directories=("node_modules" .*/)
excluded_directories=("node_modules" ".next" ".git" ".vscode", "resources")

remote_directory="$REMOTE_SERVER:/opt/japanese-reviews-next"

echo "Copy .env file that would be otherwise excluded..."
sshpass -p "$password" scp $SCRIPTS_DIR/../.env.local "$remote_directory"

echo "Copy files recursively except excluded directories..."
for file in $SCRIPTS_DIR/../*; do
    # Check if the file is a directory and if it should be excluded
    if [[ -d "$file" ]] && [[ ! "${excluded_directories[@]}" =~ "$(basename "$file")" ]]; then
        # Copy directory recursively
        echo "Copying:" $file
        sshpass -p "$password" scp -r "$file" "$remote_directory"
    elif [[ -f "$file" ]]; then
        # Copy single file
        echo "Copying:" $file
        sshpass -p "$password" scp "$file" "$remote_directory"
    fi
done
echo "Finished!"


