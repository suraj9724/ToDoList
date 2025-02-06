import { useState } from "react";
import NoteContext from "./notecontext";

const Notestate = (props) => {
    const host = "http://localhost:5000";
    const [notes, setNotes] = useState([]);

    const sortNotesByDate = (notesArray) => {
        return notesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const getNotes = async () => {
        try {
            const response = await fetch(`${host}/api/note/fetchNotes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            setNotes(sortNotesByDate(json));
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const addNote = async (description, dueDate) => {
        try {
            const currentDate = new Date().toISOString();
            const response = await fetch(`${host}/api/note/addnote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    description,
                    dueDate,
                    date: currentDate,
                    isCompleted: false
                })
            });
            const note = await response.json();
            setNotes([note, ...notes]);
        } catch (error) {
            console.error(error.message);
        }
    };

    const deleteNote = async (id) => {
        try {
            await fetch(`${host}/api/note/deletenote/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            setNotes(notes.filter((note) => note._id !== id));
        } catch (error) {
            console.error(error.message);
        }
    };

    // Updated editNote function to handle both description and dueDate
    const editNote = async (id, updates) => {
        try {
            const response = await fetch(`${host}/api/note/updatenote/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error('Failed to update note');
            }

            const updatedNote = await response.json();
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note._id === id ? updatedNote : note
                )
            );
        } catch (error) {
            console.error('Error updating note:', error);
            await getNotes();
        }
    };

    const toggleComplete = async (id) => {
        try {
            const note = notes.find(n => n._id === id);
            setNotes(prevNotes =>
                sortNotesByDate(
                    prevNotes.map(n =>
                        n._id === id ? { ...n, isCompleted: !n.isCompleted } : n
                    )
                )
            );

            const response = await fetch(`${host}/api/note/updatenote/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ isCompleted: !note.isCompleted })
            });

            if (!response.ok) {
                await getNotes();
                throw new Error('Failed to toggle completion');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <NoteContext.Provider value={{ notes, editNote, deleteNote, getNotes, addNote, toggleComplete }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default Notestate;