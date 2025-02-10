const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

router.get('/fetchNotes', fetchuser, async (req, res) => {
    try {
        const note = await Note.find({ user: req.user.id });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/addnote', fetchuser,
    [
        body('title').notEmpty().withMessage('Title is required'), // Validation for title
        body('description').isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
        body('dueDate').isISO8601().withMessage('Due date must be a valid date')
    ],
    async (req, res) => {
        try {
            const { title, description, dueDate, isCompleted, date } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Note({
                title, // Include title in note creation
                description,
                user: req.user.id,
                date: date || new Date(),
                dueDate,
                isCompleted: isCompleted || false
            });

            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

router.put('/updatenote/:id', fetchuser,
    [
        body('title').optional().notEmpty().withMessage('Title is required if provided'), // Validation for title
        body('description').optional().isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
        body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date')
    ],
    async (req, res) => {
        try {
            const { title, description, dueDate } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let note = await Note.findById(req.params.id);
            if (!note) {
                return res.status(404).json({ error: "Note not found" });
            }

            if (note.user.toString() !== req.user.id) {
                return res.status(401).json({ error: "You are not authorized to update this note" });
            }

            const updatedNote = {};
            if (title) updatedNote.title = title;
            if (description) updatedNote.description = description;
            if (dueDate) updatedNote.dueDate = dueDate;

            note = await Note.findByIdAndUpdate(req.params.id, { $set: updatedNote }, { new: true });
            res.json(note);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
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
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
