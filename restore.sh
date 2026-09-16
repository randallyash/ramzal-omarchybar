#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")" && pwd)"
dest="${XDG_CONFIG_HOME:-$HOME/.config}/omarchy"

mkdir -p "$dest/plugins"
cp -a "$root/shell.json" "$dest/shell.json"
cp -a "$root/shell.toml" "$dest/shell.toml"
cp -a "$root/plugins/ramzal."* "$dest/plugins/"
cp -a "$root/plugins/z13."* "$dest/plugins/"

usage_plugin="$dest/plugins/akitaonrails.ai-usagebar"
if [[ -d "$usage_plugin" && -d "$root/overlays/akitaonrails.ai-usagebar" ]]; then
  cp -a "$root/overlays/akitaonrails.ai-usagebar/." "$usage_plugin/"
fi

if [[ -f "$root/ai-usagebar.config.toml" ]]; then
  usage_conf="${XDG_CONFIG_HOME:-$HOME/.config}/ai-usagebar"
  mkdir -p "$usage_conf"
  cp -a "$root/ai-usagebar.config.toml" "$usage_conf/config.toml"
fi

if command -v omarchy >/dev/null 2>&1; then
  omarchy restart shell
fi

echo "Restored Omarchy bar config to $dest"
