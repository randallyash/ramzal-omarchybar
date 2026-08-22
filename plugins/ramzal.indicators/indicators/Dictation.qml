import QtQuick
import Quickshell.Io
import qs.Ui

ThemedBarIndicator {
  id: root

  property string state: "idle"
  property string icon: ""

  active: state === "recording"
  activeText: icon
  inactiveText: "󰍬"
  activeTooltipText: state
  inactiveTooltipText: "Dictate"

  function update(raw) {
    var data = extractData(raw)

    state = String(data.alt || data.class || "idle")
    if (state === "recording") icon = "󰍬"
    else if (state === "transcribing") icon = "󰔟"
    else icon = ""
  }

  Process {
    command: ["bash", "-c", "omarchy-voxtype-status"]
    running: true
    stdout: SplitParser {
      onRead: function(data) { root.update(data) }
    }
  }

  onPressed: function() {
    if (!root.bar) return
    // Config TUI needs voxtype on PATH. If it isn't installed, open the
    // official installer instead of a floating terminal that just prints
    // "voxtype: command not found".
    root.bar.run("if omarchy-cmd-present voxtype; then omarchy-voxtype-config; else omarchy-launch-floating-terminal-with-presentation omarchy-voxtype-install; fi")
  }
}
