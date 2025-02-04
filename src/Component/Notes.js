import React, { useState, useContext, useEffect } from 'react'
import noteContext from '../context/notecontext'
import Noteitem from './Noteitem'
import AddNote from './AddNote'
import { useNavigate } from 'react-router-dom'

const Notes = () => {
    const navigate = useNavigate()
    const context = useContext(noteContext)
    const { notes, getNotes, editNote } = context
    // const refClose = useRef(null)
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "" })
    const [modal, setModal] = useState(null)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        }
        else {
            navigate('/login');
        }
        // eslint-disable-next-line
    }, [])

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

    const updateNote = (currentNote) => {
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description
        })
        modal?.show()
    }

    const handlechange = async (e) => {
        e.preventDefault();
        try {
            await editNote(note.id, note.etitle, note.edescription);
            modal?.hide();
        } catch (error) {
            console.error('Failed to update note:', error);
            // Optionally show error to user
        }
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <div className="container-fluid py-4">
            <AddNote />

            {/* Modal for editing */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handlechange}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="etitle"
                                        id="etitle"
                                        value={note.etitle}
                                        onChange={onChange}
                                        minLength={3}
                                        required
                                    />
                                </div>
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

            <div className="container mt-4">
                <h2 className="text-center mb-4">Your Notes</h2>
                {notes.length === 0 ? (
                    <div className="text-center text-muted">
                        <i className="fas fa-notebook fa-3x mb-3"></i>
                        <h5>No notes yet</h5>
                        <p>Add your first note above!</p>
                    </div>
                ) : (
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
