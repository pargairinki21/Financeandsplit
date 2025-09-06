#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head
