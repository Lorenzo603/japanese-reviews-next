#!/bin/bash

# Load configuration
source $SCRIPTS_DIR/scripts-config.txt

ssh $REMOTE_SERVER -L 3567:localhost:3567
