const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const JWT_SECRET = "thestillriver@120"

const fetchUser = require('../middleware/fetchUser')

// creating user...no login required
router.post('/createUser', [
    body("name", "Enter a valid name").isLength({min : 3}),
    body('email', "Enter a valid name").isEmail(),
    body('password', "Password length should be at least 5").isLength({min : 5})
],async(req, res)=> {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        
        let user =await User.findOne({"email" : req.body.email})
        if(user) {
            return res.status(400).json({"success" : 0, "errorMessage" : "User already exist"})
        }
        const salt =await bcrypt.genSalt(10);
        const securedPass = await bcrypt.hash(req.body.password, salt) 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securedPass
        })

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        // console.log(jwtData)
        res.send({"success" : 1, "authToken" : authToken})
    } catch (error) {
        console.log(error.message)
        res.status(500).send({success : 0, errorMessage : "Some error occured. Contact the backend team"})
    } 
})

// login api ... POST "/api/auth.login"
router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "password cannot be blank").exists()
],async(req, res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;
    try {
        let user = await User.findOne({email : email})
        if(!user) {
            res.send(400).send({success : 0, errorMessage : "Please try to login with the correct credentials"})
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if(!passwordCompare) {
            res.send(400).send({success : 0, errorMessage : "Please try to login with the correct credentials"})
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.send({"success" : 1, "authToken" : authToken})
    } catch(error) {
        res.status(500).send({"success" : 0, errorMessage : "Interal server "})
    }
})

// get logged in user details using post "/api/auth/getUser"
router.post('/getUser', fetchUser,async(req, res)=> {
    try {
        userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send({success : 1, message : user})
    } catch(error) {
        console.log(error.message);
        res.status(500).send({success : 0, errorMessage : "Internal server error"})
    }
})

module.exports = router
