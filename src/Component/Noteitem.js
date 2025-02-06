import React, { useContext } from 'react';
import noteContext from '../context/notecontext';
import './Noteitem.css';

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { toggleComplete } = context;
    const { note, updateNote } = props;

    const handleDragStart = (e) => {
        if (note.isCompleted) {
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

    return (
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
                        <button
                            className="edit-btn"
                            onClick={() => updateNote(note)}
                            title='Edit note'
                        >
                            <img
                                src="/edit-icon.png"
                                alt="Edit"
                                className='edit-icon'
                                width="20"
                                height="20"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Noteitem;