'use strict'
var BN = require('bn.js')
var util = require('./util')

module.exports = function (name, powers) {
  var base = Object.keys(powers).filter(function (unit) {
    return powers[unit] === 1
  })[0]
  if (base === undefined) throw new Error('Can not find base unit')

  function Unit (value) {
    if (!(this instanceof Unit)) {
      return new Unit(value)
    }

    this._name = name

    var isValid = value === undefined || Buffer.isBuffer(value) || /^\d+$/.test(value) || util.isFiniteNumber(value)
    if (!isValid) throw new Error('Invalid value ' + value)
    this.value = new BN(value)
  }

  // 1.2 BTC => 120000000 satoshis
  Unit.parse = function (value) {
    if (typeof value !== 'string') throw new TypeError('Expected string, received: ' + value)

    var parts = value.split(' ')
    var power = powers[parts[1]]
    if (power === undefined) throw new Error('Could not find unit ' + parts[1])
    if (power === 1) return new Unit(parts[1])

    value = parts[0]
    var ppos = value.indexOf('.')
    if (ppos !== -1) {
      power -= value.length - ppos - 1
      if (power < 0) throw new Error('Invalid value ' + value)
      value = value.split('.').join('')
    }

    for (; power > 0; --power) value += '0'
    return new Unit(value)
  }

  // 120000000 satoshis => BTC 3 => 1.200 BTC
  Unit.prototype.format = function (unit, fraction) {
    var power = powers[unit]
    if (power === undefined) throw new Error('Can not find unit ' + unit)

    var value = this.toString()
    if (power !== 1) {
      value = util.zfill(value, power)
      if (value.length === power) {
        value = '0.' + value
      } else {
        value = value.slice(0, value.length - power) + '.' + value.slice(-power)
      }

      if (fraction !== undefined && fraction < power) {
        value = value.slice(0, value.indexOf('.') + 1 + fraction)
        if (value.slice(-1)[0] === '.') value = value.slice(0, -1)
      } else {
        value = util.removeTailZeros(value)
      }
    }

    return value + ' ' + unit
  }

  // arithmetic
  Unit.prototype._checkIsSameUnit = function (other) {
    if (this._name === other._name) return
    throw new TypeError('Expected ' + this._name + ', received: ' + other._name)
  }

  Unit.prototype.add = function (other) {
    this._checkIsSameUnit(other)
    this.value.iadd(other.value)
  }

  Unit.prototype.sub = function (other) {
    this._checkIsSameUnit(other)
    this.value.isub(other.value)
  }

  // serialization
  Unit.prototype.toBuffer = function (length) {
    return this.value.toArrayLike(Buffer, 'be', length)
  }

  Unit.prototype.toString = function () {
    return this.value.toString(10)
  }

  Unit.prototype.toNumber = function () {
    return this.value.toNumber()
  }

  Unit.prototype.toJSON = function () {
    return { type: this._name, value: this.value.toString() }
  }

  // console
  Unit.prototype.inspect = function () {
    return '<' + this._name + ': ' + this.toString() + ' ' + base + '>'
  }

  return Unit
}
