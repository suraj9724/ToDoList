import { useState, useCallback } from "react";
import NoteContext from "./notecontext";

const Notestate = (props) => {
    const host = "http://localhost:5000"; // Base URL for API requests
    const [notes, setNotes] = useState([]); // State to store notes
    const [loading, setLoading] = useState(false); // State to manage loading indicator

    // Utility function to sort notes by date in descending order
    const sortNotesByDate = (notesArray) => {
        return notesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    // Fetch all notes from the server
    const getNotes = useCallback(async () => {
        setLoading(true); // Set loading to true while fetching notes
        try {
            const response = await fetch(`${host}/api/note/fetchNotes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') // Auth token for authorization
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            setNotes(sortNotesByDate(json)); // Update state with sorted notes
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false); // Reset loading after operation
        }
    }, [host]);

    // Add a new note to the server and update state
    const addNote = async (title, description, dueDate) => {
        setLoading(true);
        try {
            const currentDate = new Date().toISOString(); // Get current timestamp
            const response = await fetch(`${host}/api/note/addnote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') // Auth token for authorization
                },
                body: JSON.stringify({
                    title,
                    description,
                    dueDate,
                    date: currentDate,
                    isCompleted: false // Default status for a new note
                })
            });
            const note = await response.json();
            setNotes([note, ...notes]); // Add new note to the beginning of the list
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false); // Reset loading after operation
        }
    };

    // Delete a note from the server and update state
    const deleteNote = async (id) => {
        setLoading(true);
        try {
            await fetch(`${host}/api/note/deletenote/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') // Auth token for authorization
                }
            });
            setNotes(notes.filter((note) => note._id !== id)); // Remove the deleted note from the state
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false); // Reset loading after operation
        }
    };

    // Edit an existing note on the server and update state
    const editNote = async (id, updates) => {
        setLoading(true);
        try {
            const response = await fetch(`${host}/api/note/updatenote/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') // Auth token for authorization
                },
                body: JSON.stringify(updates) // Send the updated note data
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update note: ${errorText}`);
            }

            const updatedNote = await response.json();
            // Update the state with the edited note
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note._id === id ? updatedNote : note
                )
            );
        } catch (error) {
            console.error('Error updating note:', error);
            await getNotes(); // Fallback to re-fetch all notes in case of an error
        } finally {
            setLoading(false); // Reset loading after operation
        }
    };

    // Toggle the completion status of a note
    const toggleComplete = async (id) => {
        setLoading(true);
        try {
            const note = notes.find(n => n._id === id); // Find the note to be toggled
            setNotes(prevNotes =>
                sortNotesByDate(
                    prevNotes.map(n =>
                        n._id === id ? { ...n, isCompleted: !n.isCompleted } : n
                    )
                )
            );

            const response = await fetch(`${host}/api/note/updatenote/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') // Auth token for authorization
                },
                body: JSON.stringify({ isCompleted: !note.isCompleted }) // Update completion status
            });

            if (!response.ok) {
                await getNotes(); // Re-fetch notes if there is an error
                throw new Error('Failed to toggle completion');
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false); // Reset loading after operation
        }
    };

    return (
        // Provide the state and actions to the context consumers
        <NoteContext.Provider value={{ notes, editNote, deleteNote, getNotes, addNote, toggleComplete, loading }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default Notestate;
