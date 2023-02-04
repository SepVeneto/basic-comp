#!/bin/sh

# when error exit at once
set -e

pnpm i --frozen-lockfile --registry=https://registry.npmmirror.com

pnpm build

cd dist
pnpm publish

echo "✅ Publish completed"
