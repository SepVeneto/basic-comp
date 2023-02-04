#!/bin/sh

# when error exit at once
set -e

pnpm i --frozen-lockfile

pnpm build

cd dist
pnpm publish

echo "✅ Publish completed"
