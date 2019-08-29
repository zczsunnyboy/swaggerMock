'use strict'

module.exports = time => (req, res, next) => setTimeout(next, time);