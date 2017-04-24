#!/bin/sh
set -ex
cd "$(git rev-parse --show-toplevel)" || exit 1
bundle install --retry 3 --gemfile="$BUNDLE_GEMFILE"
pip install -r ci/requirements.txt
npm install -g jshint htmlhint csslint
