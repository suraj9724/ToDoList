import { useState } from "react";
import NoteContext from "./notecontext";

const Notestate = (props) => {
    // Backend API URL
    const host = "http://localhost:5000"

    // State to store all notes
    const [notes, setNotes] = useState([]);

    // Utility function to sort notes by date
    const sortNotesByDate = (notesArray) => {
        return notesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    // Fetch all notes from the backend
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
        }
        catch (error) {
            console.error('Error fetching notes:', error);
        }
    }

    // Add a new note
    const addNote = async (title, description) => {
        try {
            const currentDate = new Date().toISOString();
            const response = await fetch(`${host}/api/note/addnote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    title,
                    description,
                    date: currentDate,
                    isCompleted: false
                })
            });
            const note = await response.json();
            // Add new note at the beginning of the array
            setNotes([note, ...notes]);
        } catch (error) {
            console.error(error.message);
        }
    }

    // Delete a note by ID
    const deleteNote = async (id) => {
        try {
            await fetch(`${host}/api/note/deletenote/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            // Remove note from state
            setNotes(notes.filter((note) => note._id !== id));
        }
        catch (error) {
            console.error(error.message);
        }
    }

    // Edit an existing note
    const editNote = async (id, title, description) => {
        try {
            const response = await fetch(`${host}/api/note/updatenote/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ title, description })
            });

            if (!response.ok) {
                throw new Error('Failed to update note');
            }

            const updatedNote = await response.json();

            // Update state with the server response
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note._id === id ? updatedNote : note
                )
            );

        } catch (error) {
            console.error('Error updating note:', error);
            // Optionally revert the optimistic update
            await getNotes();
        }
    }

    // Toggle note completion status
    const toggleComplete = async (id) => {
        try {
            const note = notes.find(n => n._id === id);
            // Update state optimistically
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
                // If request fails, revert the changes
                await getNotes();
                throw new Error('Failed to toggle completion');
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    // Provide context values to children components
    return (
        <NoteContext.Provider value={{ notes, editNote, deleteNote, getNotes, addNote, toggleComplete }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default Notestate