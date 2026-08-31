# ramzal-omarchybar

Randall’s current Omarchy status bar — layout, sizing, and the user plugins
that make it look like this machine.

Snapshot of `~/.config/omarchy` so it can be cloned onto a fresh Omarchy box.

## Layout

Left: menu · workspaces · Apple Music  
Center: indicators · keyboard · clock · weather radar · weather · updates  
Right: agents · tray · bluetooth · network · audio · monitor · Z13 power

Idle: screensaver 4 min, lock 8 min, sleep 15 min.

## What’s in here

| Path | What it is |
| --- | --- |
| `shell.json` | Bar layout, widget settings, idle, enabled/disabled plugins |
| `shell.toml` | Bar size, icon-slot tokens, font |
| `plugins/ramzal.*` | User-owned bar plugins (Omarchy clones plus local tweaks) |
| `plugins/z13.power` | GZ302 battery flyout (Max / Perf / Mid / Quiet / Low) |
| `plugins/z13.battery` | Low-battery warnings that skip stock powerprofiles |

### ramzal plugins

- `ramzal.menu` — menu button with a larger logo
- `ramzal.workspaces` — workspace indicators
- `ramzal.clock` — clock + calendar (`ddd d MMM h:mm AP`)
- `ramzal.indicators` — dictation / recording / reminder / night light / DND / stay-awake
- `ramzal.tray` — system tray (Steam pinned; z13-power SNI hidden because the flyout owns power)
- `ramzal.network` — Wi-Fi panel
- `ramzal.bar-icons` — applies `icon-slot` / `icon-canvas` / `icon-font` / `status-slot` from `shell.toml`

`shell.json` also references two third-party plugins that are **not** vendored here:

- `ianswope.apple-music` — https://github.com/ianswope/omarchy-apple-music
- `eduardodallecort.weather-radar` — https://github.com/eduardodallecort/omarchy-weather-radar

Z13 power also lives as a standalone marketplace plugin:
https://github.com/randallyash/omarchy-z13-power

## Restore

```bash
git clone https://github.com/randallyash/ramzal-omarchybar.git
cd ramzal-omarchybar
./restore.sh
```

`restore.sh` copies `shell.json`, `shell.toml`, `plugins/ramzal.*`, and
`plugins/z13.*` into `~/.config/omarchy/`, then restarts the shell.

By hand:

```bash
cp shell.json ~/.config/omarchy/shell.json
cp shell.toml ~/.config/omarchy/shell.toml
cp -a plugins/ramzal.* plugins/z13.* ~/.config/omarchy/plugins/
omarchy restart shell
```

Optional third-party plugins:

```bash
omarchy plugin add https://github.com/ianswope/omarchy-apple-music.git --enable
omarchy plugin add https://github.com/eduardodallecort/omarchy-weather-radar.git --enable
```
