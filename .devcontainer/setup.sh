#!/bin/bash -i

set -eo pipefail
echo "🚀 Setting up the-moby-effect devcontainer..."

echo "Fixing git permissions"
git config --global --add safe.directory "."
git config --global --add safe.directory "./submodules/moby-23.0-branch-max-api-1.42"
git config --global --add safe.directory "./submodules/moby-24.0-branch-max-api-1.43"
git config --global --add safe.directory "./submodules/moby-25.0-branch-max-api-1.44"
git config --global --add safe.directory "./submodules/moby-26.0-branch-max-api-1.45"
git config --global --add safe.directory "./submodules/moby-27.0-branch-max-api-1.46"

echo "Initializing submodules"
git submodule update --init --recursive --depth 1

echo "📦 Installing repo dependencies..."
npm install -g corepack@latest
corepack install
corepack enable
pnpm install

echo "🏗️ Building..."
pnpm check
pnpm lint
pnpm circular
pnpm build

echo "🧪 Testing..."
# __CONNECTION_VARIANT="socket" __PLATFORM_VARIANT="node-22.x" __DOCKER_ENGINE_VERSION="docker.io/library/docker:dind-rootless" pnpm coverage --run

echo "✅ Devcontainer setup complete!"
echo "🙏 Thank you for contributing to the-moby-effect!"
