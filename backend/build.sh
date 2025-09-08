#!/bin/bash

# Exit on any error
set -e

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

echo "Build completed successfully!"
