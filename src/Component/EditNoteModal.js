import React, { useState } from 'react';
import './EditNoteModal.css';

const EditNoteModal = ({ note, onSave, onClose }) => {

    // State to track the edited title
    const [editedTitle, setEditedTitle] = useState(note.title);
    // State to track the edited description
    const [editedDescription, setEditedDescription] = useState(note.description);

    // Handle form submission to save the edited note
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        // Call the onSave function, passing the updated note
        onSave({
            ...note, // Spread the existing note properties
            title: editedTitle, // Update title
            description: editedDescription // Update description
        });
    };

    return (
        // Modal backdrop to create a dark overlay
        <div className="modal-backdrop">
            {/* Main modal container */}
            <div className="edit-modal">
                {/* Modal header section */}
                <div className="modal-header">
                    <h5>Edit Task</h5>
                    {/* Close button to dismiss the modal */}
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {/* Form for editing note details */}
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Input field for editing the note title */}
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                value={editedTitle} // Bind the input value to state
                                onChange={(e) => setEditedTitle(e.target.value)} // Update state on change
                                required // Make the input required
                            />
                        </div>

                        {/* Input field for editing the note description */}
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                value={editedDescription} // Bind the input value to state
                                onChange={(e) => setEditedDescription(e.target.value)} // Update state on change
                                required // Make the input required
                            />
                        </div>
                    </div>

                    {/* Footer buttons for saving or canceling */}
                    <div className="modal-footer">
                        {/* Button to cancel and close the modal */}
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        {/* Submit button to save the changes */}
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
