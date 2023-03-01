#!/bin/sh

# when error exit at once
set -e

pnpm i --frozen-lockfile --registry=https://registry.npmmirror.com

pnpm build

echo "log npmrc"
cat ./.npmrc
echo "log button.d.ts"
cat dist/types/packages/components/button/src/button.d.ts

asdf;asf;sad;fkasd asfksiifesf

#cd dist/basic-comp
#sed -i "s/\"version\": \"1.0.0\",/\"version\": \"$TAG_VERSION\",/" package.json
#pnpm publish --no-git-checks --access public

echo "✅ Publish completed"
