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

echo "Copying Kanji dictionary reduced..."
sshpass -p "$password" scp $SCRIPTS_DIR/../src/resources/kanji_full_reduced.json "$remote_directory"

echo "Copying Compound verbs..."
sshpass -p "$password" scp $SCRIPTS_DIR/../src/resources/compound_verbs.json "$remote_directory"
echo "Copying Compound verbs proto..."
sshpass -p "$password" scp $SCRIPTS_DIR/../src/resources/compound_verbs_proto.json "$remote_directory"

echo "Copying Similarity dictionary..."
sshpass -p "$password" scp $SCRIPTS_DIR/../src/resources/similarity-dictionary.txt "$remote_directory"


echo "Finished!"