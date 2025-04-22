#!/bin/bash -i

set -eo pipefail
echo "🚀 Setting up the-moby-effect devcontainer..."

echo "Initializing submodules"
git submodule update --init --recursive --depth 1

echo "📦 Installing repo dependencies..."
npm install --global corepack@latest
corepack install
corepack enable
pnpm install
pnpm clean

echo "🏗️ Building..."
pnpm check
pnpm lint
pnpm circular
pnpm build
pnpm docgen

echo "🧪 Testing..."
# __CONNECTION_VARIANT="socket" __PLATFORM_VARIANT="node-22.x" __DOCKER_ENGINE_VERSION="docker.io/library/docker:dind-rootless" pnpm coverage --run

echo "✅ Devcontainer setup complete!"
echo "🙏 Thank you for contributing to the-moby-effect!"
