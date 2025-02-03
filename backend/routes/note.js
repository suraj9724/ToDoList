const express = require('express')
const router = express.Router()
var fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Notes')
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

router.get('/fetchNotes', fetchuser, async (req, res) => {
    try {
        const note = await Note.find({ user: req.user.id })
        res.json(note)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})

router.post('/addnote', fetchuser,
    [
        body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
        body('description').isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
    ],
    async (req, res) => {
        try {
            const { title, description } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = await Note.create({
                title, description, user: req.user.id
            })
            const saveNote = await note.save()
            res.json(saveNote)
        }
        catch (error) {
            console.error(error.message)
            res.status(500).send("Server Error")
        }
    }
)
router.patch('/udpatenote/:id', fetchuser,
    async (req, res) => {
        const { title, description } = req.body
        try {
            const newNote = {}
            if (title) { newNote.title = title }
            if (description) { newNote.description = description }
            let note = await Note.findById(req.params.id)
            if (!note) { return res.status(404).send("Note not found") }
            note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
            res.json(note);
        }
        catch (error) {
            console.error(error.message)
            res.status(500).send("Server Error")
        }
    }
)

router.delete('/deletenote/:id', fetchuser,
    async (req, res) => {
        try {
            let note = await Note.findById(req.params.id);
            if (!note) {
                return res.status(404).json({ error: "Note not found" });
            }

            if (note.user.toString() !== req.user.id) {
                return res.status(401).json({ error: "You are not authorized to delete this note" });
            }

            note = await Note.findByIdAndDelete(req.params.id);
            res.json({ success: true, message: "Note deleted successfully" });
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Server Error" });
        }
    }
)
module.exports = router;