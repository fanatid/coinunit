'use strict'
var test = require('tape')
var coinunit = require('../')

test('how i can use it', function (t) {
  console.log(coinunit)

  var x = coinunit.units.bitcoin.parse('1.2 BTC')
  console.log(x)
  console.log(x.format('satoshis'))
  console.log(x.format('BTC', 3))
  console.log(JSON.stringify(x))

  console.log(coinunit.units.bitcoin(1e6).format('BTC', 3))

  t.end()
})
