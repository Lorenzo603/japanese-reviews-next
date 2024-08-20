#!/bin/bash

SCRIPTS_DIR=$( dirname -- "$0"; )
echo "Scripts Dir:" $SCRIPTS_DIR

# Load configuration
source $SCRIPTS_DIR/scripts-config.txt

ssh $REMOTE_SERVER -L 3567:localhost:3567
