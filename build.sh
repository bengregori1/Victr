#!/bin/sh
# Copies index.html to dist/index.html
set -e
mkdir -p dist
cp index.html dist/index.html
echo "Built -> dist/index.html"
