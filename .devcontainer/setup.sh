#!/bin/bash -i

set -eo pipefail
echo "🚀 Setting up the-moby-effect devcontainer..."

echo "🕳️ Initializing submodules"
git submodule update --init --recursive --depth 1

echo "📦 Installing repo dependencies..."
npm install -g corepack@latest
corepack install
corepack enable
pnpm install

echo "🏗️ Building..."
pnpm build

echo "🧪 Testing..."
pnpm test --run

echo "✅ Devcontainer setup complete!"
echo "🙏 Thank you for contributing to the-moby-effect!"
