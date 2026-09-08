function clampBrightness(value) {
  var n = Number(value)
  if (!isFinite(n)) return 1
  return Math.max(1, Math.min(100, Math.round(n)))
}

function normalizeScale(scale) {
  var n = parseFloat(String(scale || ""))
  if (!isFinite(n)) return ""
  return String(Math.round(n * 100) / 100)
}

function gcd(a, b) {
  while (b) {
    var remainder = a % b
    a = b
    b = remainder
  }
  return a
}

function cleanScale(scale, width, height) {
  var requested = Number(scale)
  var modeWidth = Number(width)
  var modeHeight = Number(height)
  if (!isFinite(requested) || !isFinite(modeWidth) || !isFinite(modeHeight)
      || requested <= 0 || modeWidth <= 0 || modeHeight <= 0) return ""

  var divisor = gcd(Math.round(modeWidth * 120), Math.round(modeHeight * 120))
  var scaleUnits = Math.round(requested * 120)
  if (scaleUnits > divisor) scaleUnits = divisor
  while (divisor % scaleUnits !== 0) scaleUnits++
  return normalizeScale(scaleUnits / 120)
}

function matchingScaleIndex(scales, currentScale, width, height) {
  var current = Number(currentScale)
  if (!Array.isArray(scales) || !isFinite(current)) return -1

  var bestIndex = -1
  var bestDistance = Infinity
  var normalizedCurrent = normalizeScale(current)
  for (var i = 0; i < scales.length; i++) {
    if (cleanScale(scales[i], width, height) !== normalizedCurrent) continue

    var distance = Math.abs(Number(scales[i]) - current)
    if (distance < bestDistance) {
      bestIndex = i
      bestDistance = distance
    }
  }
  return bestIndex
}

function availableScales(scales, width, height) {
  if (!Array.isArray(scales) || Number(width) <= 0 || Number(height) <= 0) return scales || []

  var byEffectiveScale = {}
  for (var i = 0; i < scales.length; i++) {
    var requested = Number(scales[i])
    var effective = Number(cleanScale(requested, width, height))

    if (!isFinite(requested) || !isFinite(effective)) continue

    var key = normalizeScale(effective)
    var existing = byEffectiveScale[key]
    if (!existing || Math.abs(requested - effective) < existing.distance) {
      byEffectiveScale[key] = {
        value: String(scales[i]),
        index: i,
        distance: Math.abs(requested - effective)
      }
    }
  }

  return Object.keys(byEffectiveScale)
    .map(function(key) { return byEffectiveScale[key] })
    .sort(function(a, b) { return a.index - b.index })
    .map(function(candidate) { return candidate.value })
}

function brightnessName(percent) {
  var p = Math.round(percent)
  if (p >= 95) return "Sun blast"
  if (p >= 80) return "Solar flare"
  if (p >= 65) return "Golden hour"
  if (p >= 45) return "Even day"
  if (p >= 30) return "Soft glow"
  if (p >= 20) return "Lamp light"
  if (p >= 10) return "Candlelit"
  return "Night owl"
}

function parseDisplays(raw) {
  var displays = []
  try {
    displays = raw ? JSON.parse(String(raw)) : []
  } catch (e) {
    displays = []
  }
  if (!Array.isArray(displays)) displays = []

  var count = 0
  for (var i = 0; i < displays.length; i++) {
    if (displays[i] && displays[i].enabled) count++
  }

  return {
    displays: displays,
    enabledDisplayCount: count
  }
}

function parseHz(value) {
  var n = parseFloat(String(value || ""))
  if (!isFinite(n) || n <= 0) return 0
  return n
}

function roundRefresh(hz) {
  var n = parseHz(hz)
  if (!n) return 0
  return Math.round(n)
}

function matchingRefreshIndex(rates, currentHz) {
  var current = parseHz(currentHz)
  if (!Array.isArray(rates) || !current) return -1

  var bestIndex = -1
  var bestDistance = Infinity
  for (var i = 0; i < rates.length; i++) {
    var distance = Math.abs(Number(rates[i]) - current)
    if (distance < bestDistance) {
      bestIndex = i
      bestDistance = distance
    }
  }
  return bestIndex >= 0 && bestDistance <= 2 ? bestIndex : -1
}

function nativeRefreshRates(availableModes, width, height) {
  var rates = []
  var w = Number(width)
  var h = Number(height)
  var want = (isFinite(w) && isFinite(h) && w > 0 && h > 0)
    ? (Math.round(w) + "x" + Math.round(h)) : ""
  if (!availableModes || typeof availableModes.length !== "number") return rates

  for (var i = 0; i < availableModes.length; i++) {
    var mode = String(availableModes[i] || "")
    var at = mode.lastIndexOf("@")
    if (at < 0) continue
    var res = mode.slice(0, at)
    if (want && res !== want) continue
    var hz = roundRefresh(mode.slice(at + 1).replace(/Hz$/i, ""))
    if (!hz || rates.indexOf(hz) !== -1) continue
    rates.push(hz)
  }

  rates.sort(function(a, b) { return a - b })
  return rates
}

function refreshPresets(availableModes, width, height) {
  var wanted = [60, 180]
  var native = nativeRefreshRates(availableModes, width, height)
  if (!native.length) return wanted

  var out = []
  for (var i = 0; i < wanted.length; i++) {
    if (matchingRefreshIndex(native, wanted[i]) !== -1) out.push(wanted[i])
  }
  return out.length ? out : native
}

function vrrPresets() {
  return [
    { value: 0, label: "Off" },
    { value: 1, label: "On" },
    { value: 2, label: "Fullscreen" }
  ]
}

function clampVrr(value) {
  var n = parseInt(value, 10)
  if (n === 1 || n === 2) return n
  return 0
}

function vrrLabel(mode, active) {
  if (mode === 0) return "Off"
  if (active) return "Active"
  if (mode === 1) return "On"
  if (mode === 2) return "Fullscreen"
  return "Off"
}

if (typeof module !== "undefined") {
  module.exports = {
    clampBrightness: clampBrightness,
    normalizeScale: normalizeScale,
    cleanScale: cleanScale,
    matchingScaleIndex: matchingScaleIndex,
    availableScales: availableScales,
    brightnessName: brightnessName,
    parseDisplays: parseDisplays,
    parseHz: parseHz,
    roundRefresh: roundRefresh,
    matchingRefreshIndex: matchingRefreshIndex,
    nativeRefreshRates: nativeRefreshRates,
    refreshPresets: refreshPresets,
    vrrPresets: vrrPresets,
    clampVrr: clampVrr,
    vrrLabel: vrrLabel
  }
}
