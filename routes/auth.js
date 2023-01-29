const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

// creating user...no login required
router.post('/createUser', [
    body("name", "Enter a valid name").isLength({min : 3}),
    body('email', "Enter a valid name").isEmail(),
    body('password', "Password length should be at least 5").isLength({min : 5})
],(req, res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }).then(user => res.json(user))
      .catch(err=>{
        console.log(err)
        res.send({success:0, message: "User with this email id already exist"})
      }
      )
})

module.exports = router
