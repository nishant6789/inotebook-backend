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

// update note using PUT /api/notes/updateNote
router.put('/updateNote/:id', fetchUser,async(req, res)=> {
    try {
        const {title, description, tag} = req.body;

        const newNote = {};
        if(title) {
            newNote.title = title;
        }
        if(description) {
            newNote.description = description
        }
        if(tag) {
            newNote.tag = tag
        }

        // Find the note to be updated
        let note = await Notes.findById(req.params.id)
        if(!note) {
            return res.status(400).send("Not found");
        }

        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set : newNote}, {new : true})

        res.send({success : 1, message : note})
    } catch {
        console.log(error.message);
        res.status(500).send({success : 0, errorMessage : "Internal Serve Error"})
    }
})

//delete a note by DELETE /api/notes/deleteNote
router.delete('/deleteNote/:id', fetchUser,async(req, res)=> {
    try {
        const {title, description, tag} = req.body;

        // Find the note to be updated
        let note = await Notes.findById(req.params.id)
        if(!note) {
            return res.status(400).send({success : 0, errorMessage : "Not found"});
        }

        // allow deletion if only user owns this note
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send({success : 0, errorMessage : "Not allowed"})
        }

        note = await Notes.findByIdAndDelete(req.params.id)

        res.send({success : 1, message : "Successfully deleted"})
    } catch {
        console.log(error.message);
        res.status(500).send({success : 0, errorMessage : "Internal Serve Error"})
    }
})

module.exports = router
