#!/bin/bash

read -s -p "Enter the password: " password
echo

SCRIPTS_DIR=$( dirname -- "$0"; )
echo "Scripts Dir:" $SCRIPTS_DIR

# Load configuration
source $SCRIPTS_DIR/scripts-config.txt

remote_directory="$REMOTE_SERVER:/opt/configs/japanese-reviews-next"

echo "Copying Kanji dictionary..."
sshpass -p "$password" scp $SCRIPTS_DIR/../src/resources/kanji_full.json "$remote_directory"
echo "Copying Vocabulary dictionary..."
sshpass -p "$password" scp $SCRIPTS_DIR/../src/resources/vocabulary_full.json "$remote_directory"


echo "Finished!"