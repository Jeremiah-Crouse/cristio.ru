#!/bin/bash
# Revert OpenCode to official latest release (undo custom build)
set -e
echo "Removing patched binary..."
rm -f ~/.opencode/bin/opencode /opt/homebrew/bin/opencode /usr/local/bin/opencode 2>/dev/null
echo "Downloading official OpenCode release..."
curl -fsSL https://opencode.ai/install | bash
cp ~/.opencode/bin/opencode /opt/homebrew/bin/opencode 2>/dev/null || true
echo "Done. The official binary has replaced any custom build."
