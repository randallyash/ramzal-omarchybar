#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")" && pwd)"
dest="${XDG_CONFIG_HOME:-$HOME/.config}/omarchy"

mkdir -p "$dest/plugins"
cp -a "$root/shell.json" "$dest/shell.json"
cp -a "$root/shell.toml" "$dest/shell.toml"
cp -a "$root/plugins/ramzal."* "$dest/plugins/"
cp -a "$root/plugins/z13."* "$dest/plugins/"

if command -v omarchy >/dev/null 2>&1; then
  omarchy restart shell
fi

echo "Restored Omarchy bar config to $dest"
