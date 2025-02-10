import React, { useState, useContext } from 'react';
import './ShowTaskModal.css';
import DeleteConfirmModal from './DeleteConfirmModal';
import EditNoteModal from './EditNoteModal';
import noteContext from '../context/notecontext';

const ShowTaskModal = ({ note, onDelete, onClose }) => {
    const { editNote } = useContext(noteContext); // Get editNote from context
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);

    const handleDeleteConfirm = () => {
        onDelete(note._id);
        setDeleteModalVisible(false);
    };

    const handleDeleteCancel = () => {
        setDeleteModalVisible(false);
    };

    const handleEditSave = async (editedNote) => {
        await editNote(note._id, editedNote); // Ensure _id is included
        setEditModalVisible(false);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h4>{note.title}</h4> {/* Display the note title */}
                <p>{note.description}</p>
                <p>Due Date: {new Date(note.dueDate).toLocaleDateString()}</p>
                <div className="modal-actions">
                    <button onClick={() => setEditModalVisible(true)} className="edit-btn">Edit</button>
                    <button onClick={() => setDeleteModalVisible(true)} className="delete-btn">Delete</button>
                </div>
            </div>
            {isDeleteModalVisible && (
                <DeleteConfirmModal
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
            {isEditModalVisible && (
                <EditNoteModal
                    note={note}
                    onSave={handleEditSave}
                    onClose={() => setEditModalVisible(false)}
                />
            )}
        </div>
    );
};

export default ShowTaskModal;
