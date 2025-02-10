import { useState, useCallback } from "react";
import NoteContext from "./notecontext";

const Notestate = (props) => {
    const host = "http://localhost:5000";
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const sortNotesByDate = (notesArray) => {
        return notesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const getNotes = useCallback(async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }, [host]);

    const addNote = async (title, description, dueDate) => {
        setLoading(true);
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
                    dueDate,
                    date: currentDate,
                    isCompleted: false
                })
            });
            const note = await response.json();
            setNotes([note, ...notes]);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteNote = async (id) => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const editNote = async (id, updates) => {
        setLoading(true);
        try {
            const response = await fetch(`${host}/api/note/updatenote/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update note: ${errorText}`);
            }

            const updatedNote = await response.json();
            // console.log('Updated note:', updatedNote);
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note._id === id ? updatedNote : note
                )
            );
        } catch (error) {
            console.error('Error updating note:', error);
            await getNotes();
        } finally {
            setLoading(false);
        }
    };

    const toggleComplete = async (id) => {
        setLoading(true);
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
                method: 'PUT',
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <NoteContext.Provider value={{ notes, editNote, deleteNote, getNotes, addNote, toggleComplete, loading }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default Notestate;
