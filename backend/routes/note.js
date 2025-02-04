const express = require('express')
const router = express.Router()
var fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');

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
            const { title, description, isCompleted, date } = req.body;
            // console.log('Received date:', date);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Note({
                title,
                description,
                user: req.user.id,
                date: date || new Date(),
                isCompleted: isCompleted || false
            });

            // console.log('Saving note with date:', note.date);
            const savedNote = await note.save();
            // console.log('Saved note:', savedNote);
            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
)
router.patch('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, isCompleted } = req.body;

        // Find the note first
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        // Verify user ownership
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        // Build update object
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;
        if (isCompleted !== undefined) updateFields.isCompleted = isCompleted;

        // Update the note
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.json(updatedNote);

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: "Error updating note" });
    }
});

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