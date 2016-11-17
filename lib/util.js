'use strict'
exports.isFiniteNumber = function (value) {
  return typeof value === 'number' && isFinite(value)
}

exports.zfill = function (value, length) {
  while (value.length < length) value = '0' + value
  return value
}

exports.removeTailZeros = function (value) {
  var last = value.length - 1
  while (value[last] === '0' && value[last - 1] !== '.') last -= 1
  return value.slice(0, last + 1)
}
