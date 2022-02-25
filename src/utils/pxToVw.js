export function getUnitRegexp(unit) {
  return new RegExp(
    '"[^"]+"|\'[^\']+\'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)' + unit,
    'g'
  );
}

export function createPxReplace(opts, viewportUnit, viewportSize) {
  return function (m, $1) {
    if (!$1) {
      return m;
    }
    var pixels = parseFloat($1);
    if (pixels <= opts.minPixelValue) {
      return m;
    }
    var parsedVal = toFixed((pixels / viewportSize) * 100, opts.unitPrecision);
    return parsedVal === 0 ? '0' : parsedVal + viewportUnit;
  };
}

function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}
