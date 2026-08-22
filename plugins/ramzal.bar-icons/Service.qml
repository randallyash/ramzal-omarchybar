import QtQuick
import qs.Commons

// Stock Style.applyShellValues only copies [bar] size-horizontal / size-vertical
// into Style.barOverrides. Icon tokens exist (icon-slot, icon-canvas, icon-font,
// status-slot) and BarIconButton reads them, but they are dropped on parse.
// Re-apply those keys from the merged shell.toml whenever Style resets.
Item {
  id: root
  property var shell: null

  readonly property var tokenKeys: ["icon-slot", "icon-canvas", "icon-font", "status-slot"]

  function extraBarTokens() {
    var src = Color.shellValues || {}
    var out = {}
    for (var i = 0; i < tokenKeys.length; i++) {
      var key = tokenKeys[i]
      var n = parseInt(src["bar." + key], 10)
      if (isFinite(n) && n > 0) out[key] = n
    }
    return out
  }

  function apply() {
    var extra = extraBarTokens()
    var cur = Style.barOverrides || {}
    var next = {}
    var changed = false
    for (var k in cur) next[k] = cur[k]
    for (var ek in extra) {
      if (Number(next[ek]) !== Number(extra[ek])) {
        next[ek] = extra[ek]
        changed = true
      }
    }
    if (changed) Style.barOverrides = next
  }

  Connections {
    target: Style
    function onBarOverridesChanged() { Qt.callLater(root.apply) }
  }

  Connections {
    target: Color
    function onShellValuesChanged() { Qt.callLater(root.apply) }
  }

  Component.onCompleted: Qt.callLater(root.apply)
}
