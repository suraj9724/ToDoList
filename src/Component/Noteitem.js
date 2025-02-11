import React, { useContext, useState } from 'react';
import noteContext from '../context/notecontext';
import ShowTaskModal from './ShowTaskModal';
import './Noteitem.css';

const Noteitem = (props) => {
    const context = useContext(noteContext);

    const { toggleComplete, deleteNote } = context;
    const { note, updateNote, onDelete } = props;
    const [showShowTaskModal, setShowShowTaskModal] = useState(false);

    const handleDragStart = (e) => {
        if (note.isCompleted || !note.dueDate) {
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

    return (
        <>
            <div
                className="note-item p-2 border rounded-black bg-light"
                draggable={!note.isCompleted}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                style={{ border: '1px solid #ccc' }}
            >
                <div className="d-flex justify-content-between align-items-center ">
                    <div className="form-check d-flex align-items-center w-100 gap-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={note.isCompleted}
                            onChange={() => toggleComplete(note._id)}
                            id={`checkbox-${note._id}`}
                            style={{ border: '1px solid black' }}
                        />
                        <label
                            className={`form-check-label mb-0 ${note.isCompleted ? 'text-decoration-line-through' : ''}`}
                            htmlFor={`checkbox-${note._id}`}
                        >
                            <strong>
                                {note.title.length > 5 ? `${note.title.slice(0, 5)}...` : note.title}
                            </strong>
                        </label>
                    </div>
                    <button
                        className="btn btn-link p-0"
                        onClick={handleShowTask}
                        title="Show task"
                    >
                        <img src="/eye-icon.svg" alt="Show" className="action-icon eye-icon" width="20" height="20" />
                    </button>
                </div>
            </div>

            {showShowTaskModal && (
                <ShowTaskModal
                    note={note}
                    onEdit={(editedNote) => updateNote(editedNote)}
                    onDelete={async () => {
                        await deleteNote(note._id);
                        onDelete('Task deleted successfully');
                    }}
                    onClose={() => setShowShowTaskModal(false)}
                />
            )}
        </>
    );
};

export default Noteitem;
