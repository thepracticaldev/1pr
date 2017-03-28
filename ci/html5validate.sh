#!/bin/sh
cd "$(git rev-parse --show-toplevel)"
html5validator --root .
