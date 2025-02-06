import React, { useState, useContext } from 'react';
import noteContext from '../context/notecontext';

const AddNote = () => {
    const context = useContext(noteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ description: "", dueDate: "" });
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedDate = new Date(note.dueDate);
        const currentDate = new Date();

        // Allow the current date as a valid due date
        if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
            setError("Due date cannot be in the past.");
            return;
        }

        setError(""); // Clear any previous error
        addNote(note.description.trim(), note.dueDate);
        setNote({ description: "", dueDate: "" });
    };

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title mb-4 text-center">Add a New Task</h4>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={note.description}
                                        onChange={onChange}
                                        minLength={5}
                                        required
                                        rows="3"
                                        placeholder="Enter description (min 5 characters)"
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dueDate" className="form-label">Due Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dueDate"
                                        name="dueDate"
                                        value={note.dueDate}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                        disabled={note.description.length < 5}
                                    >
                                        Add Note
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNote;
