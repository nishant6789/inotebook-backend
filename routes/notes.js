const express = require('express')
const res = require('express/lib/response')
const router = express.Router()

router.get('/', (req, res)=> {
    obj = {
        name: "Nishant",
        surname: "Sharma"
    }
    res.json(obj)
})

module.exports = router
