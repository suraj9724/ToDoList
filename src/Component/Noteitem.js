import React, { useContext, useState } from 'react';
import noteContext from '../context/notecontext';
import EditNoteModal from './EditNoteModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import ShowTaskModal from './ShowTaskModal';
import './Noteitem.css';

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { toggleComplete, deleteNote } = context;
    const { note, updateNote, onDelete } = props;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showShowTaskModal, setShowShowTaskModal] = useState(false);

    const handleDragStart = (e) => {
        if (note.isCompleted) {
            e.preventDefault();
            return;
        }
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
    const handleShowTask = () => {
        setShowShowTaskModal(true);
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

    const handleEditSave = (editedNote) => {
        updateNote(editedNote);
        setShowEditModal(false);
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
                            <label className={`form-check-label mb-0 flex-grow-1 ${note.isCompleted ? 'completed-note' : ''}`} htmlFor={`checkbox-${note._id}`}>
                                <strong>{note.title}</strong>
                            </label>
                        </div>
                        <div className="d-flex align-items-center">
                            <button className="icon-btn me-2" onClick={handleShowTask} title='Show task'>
                                <img src="/eye-icon.svg" alt="Show" className="action-icon" width="20" height="20" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showShowTaskModal && (
                <ShowTaskModal
                    note={note}
                    onEdit={handleEditSave}
                    onDelete={handleDeleteConfirm} // Trigger delete confirmation
                    onClose={() => setShowShowTaskModal(false)}
                />
            )}
        </>
    );
};

export default Noteitem;
