import React, { useState } from 'react';
import './ShowTaskModal.css';
import DeleteConfirmModal from './DeleteConfirmModal';
import EditNoteModal from './EditNoteModal';

const ShowTaskModal = ({ note, onEdit, onDelete, onClose }) => {
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);

    const handleDeleteConfirm = () => {
        onDelete(note._id);
        setDeleteModalVisible(false);
    };

    const handleDeleteCancel = () => {
        setDeleteModalVisible(false);
    };

    const handleEditSave = (editedNote) => {
        onEdit(editedNote);
        setEditModalVisible(false);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h4>{note.title}</h4>
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
