#!/bin/sh
set -ex
cd "$(git rev-parse --show-toplevel)"
mdl -g -r '~MD013' .
html5validator --root .
htmlhint .
jshint --config=.jshintrc .
csslint --exclude-list=vendor .
