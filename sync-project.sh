#!/bin/bash

set -u

# ==========================================
# CONFIGURATION
# ==========================================

PROJECT_NAME="hogetbot"
BUILD_NAME="bots-hoget"
CONTAINER_PATH="/app"

LOCAL_CODE_DIR="."
SERVER_CODE_DIR="~/projects/$PROJECT_NAME/"
SERVER_DATA_DIR="~/data/$PROJECT_NAME"

LOCAL_DB_DIR="db/"
LOCAL_ENV_DIR=".env"

SERVER_DB_DIR="db/"
SERVER_ENV_DIR=".env"

# =========================================

LOCAL_DB_PATH="$LOCAL_CODE_DIR/$LOCAL_DB_DIR"
LOCAL_ENV_PATH="$LOCAL_CODE_DIR/$LOCAL_ENV_DIR"

SERVER_DB_PATH="$SERVER_DATA_DIR/$SERVER_DB_DIR"
SERVER_ENV_PATH="$SERVER_DATA_DIR/$SERVER_ENV_DIR"

# ==========================================
# PULL DB
# ==========================================

echo "Pulling latest database from server..."

rsync -rvzt "$SERVER:$SERVER_DB_PATH" "$LOCAL_DB_PATH"

echo "Database pull complete!"

# ==========================================
# PUSH CODE
# ==========================================

echo "Syncing local code to server..."

rsync -rvzt --delete \
  --exclude ".git/" \
  --exclude 'node_modules/' \
  --exclude "$LOCAL_DB_DIR" \
  --exclude "$LOCAL_ENV_DIR" \
  "$LOCAL_CODE_DIR" "$SERVER:$SERVER_CODE_DIR"

echo "Code sync complete!"

# ==========================================
# RESTART
# ==========================================

echo "Restarting app on server..."

ssh $SERVER "
cd $SERVER_CODE_DIR &&
docker build -t $BUILD_NAME . &&
docker stop $BUILD_NAME
docker rm $BUILD_NAME
docker run -d \
  --name $BUILD_NAME \
  -v $SERVER_DB_PATH:$CONTAINER_PATH/$LOCAL_DB_DIR:Z \
  -v $SERVER_ENV_PATH:$CONTAINER_PATH/$LOCAL_ENV_DIR:Z \
  --restart always \
  --network=container:gluetun \
  $BUILD_NAME
"

echo "All done!"