import React, { useContext, useState } from 'react';
import noteContext from '../context/notecontext';
import EditNoteModal from './EditNoteModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import './Noteitem.css';

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { toggleComplete, deleteNote } = context;
    const { note, updateNote, onDelete } = props;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDragStart = (e) => {
        // Don't allow dragging if the note is completed
        if (note.isCompleted) {
            e.preventDefault();
            return;
        }
        // Don't allow dragging if note has no due date
        if (!note.dueDate) {
            e.preventDefault();
            return;
        }
        e.target.classList.add('dragging');
        e.dataTransfer.setData('noteId', note._id);
        e.dataTransfer.setData('noteData', JSON.stringify(note));
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
    };

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleSave = (updatedNote) => {
        updateNote(updatedNote);
        setShowEditModal(false);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteNote(note._id);
            onDelete('Task deleted successfully');
        } catch (error) {
            onDelete('Error deleting task');
        }
        setShowDeleteModal(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    return (
        <>
            <div
                className='col-md-12 mb-3'
                draggable={!note.isCompleted}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className={`card shadow-sm ${!note.isCompleted ? 'draggable-note' : ''}`}>
                    <div className="card-body py-2 d-flex justify-content-between align-items-center">
                        <div className="form-check d-flex align-items-center w-100">
                            <input
                                className="form-check-input me-2"
                                type="checkbox"
                                checked={note.isCompleted}
                                onChange={() => toggleComplete(note._id)}
                                id={`checkbox-${note._id}`}
                            />
                            <label
                                className={`form-check-label mb-0 flex-grow-1 ${note.isCompleted ? 'completed-note' : ''}`}
                                htmlFor={`checkbox-${note._id}`}
                            >
                                {note.description}
                            </label>
                            <div className="d-flex align-items-center">
                                <button
                                    className="icon-btn me-2"
                                    onClick={handleEdit}
                                    title='Edit note'
                                >
                                    <img
                                        src="/edit-icon.png"
                                        alt="Edit"
                                        className="action-icon"
                                        width="20"
                                        height="20"
                                    />
                                </button>
                                <button
                                    className="icon-btn"
                                    onClick={handleDeleteClick}
                                    title='Delete note'
                                >
                                    <img
                                        src="/delete-icon.png"
                                        alt="Delete"
                                        className="action-icon"
                                        width="20"
                                        height="20"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showEditModal && (
                <EditNoteModal
                    note={note}
                    onSave={handleSave}
                    onClose={() => setShowEditModal(false)}
                />
            )}
            {showDeleteModal && (
                <DeleteConfirmModal
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </>
    );
};

export default Noteitem;