import React, { useState } from 'react';
import './EditNoteModal.css';

const EditNoteModal = ({ note, onSave, onClose }) => {

    const [editedTitle, setEditedTitle] = useState(note.title);
    const [editedDescription, setEditedDescription] = useState(note.description);

    // Handle form submission to save the edited note
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...note,
            title: editedTitle,
            description: editedDescription
        });
    };

    return (
        <div className="modal-backdrop">
            <div className="edit-modal">
                <div className="modal-header">
                    <h5>Edit Task</h5>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditNoteModal;
