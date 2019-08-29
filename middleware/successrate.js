'use strict'

module.exports = rate => {
    return (req, res, next) => {
        if (rate > Math.random()) return next()
        return next(500)
    }
}