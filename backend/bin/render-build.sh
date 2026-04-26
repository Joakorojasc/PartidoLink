#!/usr/bin/env bash
set -o errexit

cd backend
bundle install
bundle exec rails db:migrate
bundle exec rails db:seed
