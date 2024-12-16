#!/bin/bash

read -s -p "Enter the password: " password
echo

SCRIPTS_DIR=$( dirname -- "$0"; )
echo "Scripts Dir:" $SCRIPTS_DIR

# Load configuration
source $SCRIPTS_DIR/scripts-config.txt

remote_directory="$REMOTE_SERVER:/opt/configs/japanese-reviews-next"

echo "Copy .env LOCAL file..."
sshpass -p "$password" scp $SCRIPTS_DIR/../.env.local "$remote_directory"

echo "Copy .env PRODUCTION file..."
sshpass -p "$password" scp $SCRIPTS_DIR/../.env.production "$remote_directory"


echo "Finished!"


