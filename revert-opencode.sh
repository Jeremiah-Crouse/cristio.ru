#!/bin/bash
# Revert OpenCode to official latest release (undo custom build)
set -e
echo "Downloading official OpenCode release..."
# Remove any custom build first
rm -f ~/.opencode/bin/opencode
curl -fsSL https://opencode.ai/install | bash
echo "Done. The official binary has replaced any custom build."
