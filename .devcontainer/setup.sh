#!/bin/bash -i

set -eo pipefail
echo "🚀 Setting up the-moby-effect devcontainer..."

echo "🕳️ Initializing submodules"
git submodule update --init --recursive

echo "📦 Installing repo dependencies..."
corepack install
corepack enable
pnpm install

echo "🏗️ Building..."
pnpm build

echo "🧪 Testing..."
pnpm test

echo "✅ Devcontainer setup complete!"
echo "🙏 Thank you for contributing to the-moby-effect!"
echo "📝 P.S Don't forget to configure your git credentials with 'git config --global user.name you' and 'git config --global user.email you@z.com'"
