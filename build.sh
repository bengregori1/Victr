#!/bin/sh
# Reads .env and injects BEEHIIV_API_KEY / BEEHIIV_PUB_ID into greco.html -> dist/greco.html

set -e

if [ ! -f .env ]; then
  echo "Error: .env not found" >&2
  exit 1
fi

# Load .env
export $(grep -v '^#' .env | xargs)

if [ -z "$BEEHIIV_API_KEY" ] || [ -z "$BEEHIIV_PUB_ID" ]; then
  echo "Error: BEEHIIV_API_KEY and BEEHIIV_PUB_ID must be set in .env" >&2
  exit 1
fi

mkdir -p dist
sed -e "s|__BEEHIIV_API_KEY__|$BEEHIIV_API_KEY|g" \
    -e "s|__BEEHIIV_PUB_ID__|$BEEHIIV_PUB_ID|g" \
    greco.html > dist/index.html

echo "Built -> dist/index.html"
