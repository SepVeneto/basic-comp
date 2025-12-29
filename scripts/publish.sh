#!/bin/sh

# when error exit at once
set -e

pnpm i --frozen-lockfile --registry=https://registry.npmmirror.com

pnpm build

cd dist/basic-comp
sed -i "s/\"version\": \"1.0.0\",/\"version\": \"$TAG_VERSION\",/" package.json
npm publish --no-git-checks --access public

echo "✅ Publish completed"
