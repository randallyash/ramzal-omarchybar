# ramzal-omarchybar

Backup of Randall's Omarchy status bar (the Quickshell bar that replaced Waybar).

Exported from `~/.config/omarchy` so it can be cloned back onto a fresh machine.

## What is in here

| Path | What it is |
| --- | --- |
| `shell.json` | Bar layout, widget settings, idle lock/screensaver |
| `shell.toml` | Bar size and icon-slot tokens |
| `plugins/ramzal.*` | User-owned bar plugins (clones plus local tweaks) |

### Plugins

- `ramzal.menu` — Omarchy menu button with a larger logo
- `ramzal.workspaces` — workspace indicators (cloned from `omarchy.workspaces`)
- `ramzal.clock` — clock + calendar popup
- `ramzal.indicators` — dictation / recording / reminder / night light / DND / stay-awake
- `ramzal.tray` — system tray, including the Z13 power flyout
- `ramzal.network` — Wi-Fi panel
- `ramzal.bar-icons` — applies `icon-slot` / `icon-canvas` / `icon-font` / `status-slot` from `shell.toml`

`shell.json` also references two third-party plugins that are **not** in this repo (they have their own remotes):

- `ianswope.apple-music` — https://github.com/ianswope/omarchy-apple-music
- `eduardodallecort.weather-radar` — https://github.com/eduardodallecort/omarchy-weather-radar

## Restore

```bash
git clone ssh://git@forgejo.fifthdread.com:223/Ramzal/ramzal-omarchybar.git
cd ramzal-omarchybar
./restore.sh
```

`restore.sh` copies `shell.json`, `shell.toml`, and `plugins/ramzal.*` into `~/.config/omarchy/`, then restarts the shell.

To restore by hand:

```bash
cp shell.json ~/.config/omarchy/shell.json
cp shell.toml ~/.config/omarchy/shell.toml
cp -a plugins/ramzal.* ~/.config/omarchy/plugins/
omarchy restart shell
```

Optional third-party plugins:

```bash
omarchy plugin clone https://github.com/ianswope/omarchy-apple-music
omarchy plugin clone https://github.com/eduardodallecort/omarchy-weather-radar
```

## Download as a zip

https://forgejo.fifthdread.com/Ramzal/ramzal-omarchybar/archive/main.zip
