'use strict'
exports.create = require('./unit')
exports.units = require('./units.json').reduce(function (units, config) {
  units[config.export] = exports.create(config.name, config.powers)
  return units
}, {})
