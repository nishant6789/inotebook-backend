const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

//Get all the notes by usingget api  "/api/notes/fetchAllNotes"
router.get('/fetchAllNotes', fetchUser, async(req, res)=> {
    const notes = await Notes.find({user : req.user.id})
    res.send({success : 1, message : notes})
})

router.post('/addNotes',  [
    body("title", "Enter a valid title").isLength({min : 3}),
    body('description', "Enter a valid description").isLength({min : 5})
],fetchUser, async(req, res)=> {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const {title, description, tag} = req.body
        user = req.user.id
        const note = new Notes({
            title, description, tag, user
        })
        const saveNote = await note.save()
        res.send({success : 1, message : saveNote})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({success : 0, errorMessage : "Internal Serve Error"})
    }
})

module.exports = router
