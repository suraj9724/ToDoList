import React, { useState, useContext, useEffect } from 'react'
import noteContext from '../context/notecontext'
import Noteitem from './Noteitem'
import AddNote from './AddNote'
import { useNavigate } from 'react-router-dom'

const Notes = () => {
    // Initialize navigation
    const navigate = useNavigate()

    // Get context and required functions
    const context = useContext(noteContext)
    const { notes, getNotes, editNote } = context

    // State for managing note editing and modal
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "" })
    const [modal, setModal] = useState(null)

    // Effect to check authentication and fetch notes
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        }
        else {
            navigate('/login');
        }
        // eslint-disable-next-line
    }, [])

    // Effect to initialize Bootstrap modal
    useEffect(() => {
        // Initialize modal
        const modalElement = document.getElementById('exampleModal')
        if (modalElement) {
            const bootstrapModal = new window.bootstrap.Modal(modalElement)
            setModal(bootstrapModal)

            // Add event listener for modal close
            modalElement.addEventListener('hidden.bs.modal', () => {
                setNote({ id: "", etitle: "", edescription: "" });
            });
        }
    }, [])

    // Handler for updating note details
    const updateNote = (currentNote) => {
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description
        })
        modal?.show()
    }

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editNote(note.id, note.etitle, note.edescription);
            modal?.hide();
        } catch (error) {
            console.error('Failed to update note:', error);
            // Optionally show error to user
        }
    }

    // Handler for input changes
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <div className="container-fluid py-4">
            {/* Add Note Component */}
            <AddNote />

            {/* Edit Note Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {/* Title Input */}
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="etitle"
                                        name="etitle"
                                        value={note.etitle}
                                        onChange={onChange}
                                        minLength={3}
                                        required
                                    />
                                </div>
                                {/* Description Input */}
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="edescription"
                                        id="edescription"
                                        value={note.edescription}
                                        onChange={onChange}
                                        minLength={5}
                                        required
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>
                            {/* Modal Footer with Action Buttons */}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={note.etitle.length < 3 || note.edescription.length < 5}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Notes Display Section */}
            <div className="container mt-4">
                <h2 className="text-center mb-4">Your Notes</h2>
                {notes.length === 0 ? (
                    // Empty state message
                    <div className="text-center text-muted">
                        <i className="fas fa-notebook fa-3x mb-3"></i>
                        <h5>No notes yet</h5>
                        <p>Add your first note above!</p>
                    </div>
                ) : (
                    // Notes Grid
                    <div className="row">
                        {notes
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((note) => (
                                <Noteitem key={note._id} updateNote={updateNote} note={note} />
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notes
