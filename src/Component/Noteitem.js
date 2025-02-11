import React, { useContext, useState } from 'react';
import noteContext from '../context/notecontext';
import ShowTaskModal from './ShowTaskModal';
import './Noteitem.css';

const Noteitem = (props) => {
    const context = useContext(noteContext); // Accessing note context
    const { toggleComplete, deleteNote } = context; // Extracting required functions from context
    const { note, updateNote, onDelete } = props; // Destructuring props
    const [showShowTaskModal, setShowShowTaskModal] = useState(false); // State to manage the visibility of the "Show Task" modal

    // Handles drag start event for draggable note items
    const handleDragStart = (e) => {
        if (note.isCompleted || !note.dueDate) { // Prevent drag if note is completed or doesn't have a due date
            e.preventDefault();
            return;
        }
        e.target.classList.add('dragging'); // Add dragging class for visual feedback
        e.dataTransfer.setData('noteId', note._id); // Attach note ID to the drag event
        e.dataTransfer.setData('noteData', JSON.stringify(note)); // Attach note data as JSON to the drag event
    };

    // Handles drag end event to remove visual feedback
    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
    };

    // Toggles the "Show Task" modal visibility
    const handleShowTask = () => {
        setShowShowTaskModal(true);
    };

    return (
        <>
            {/* Note item card */}
            <div
                className="note-item p-2 border rounded-black bg-light"
                draggable={!note.isCompleted} // Make item draggable only if it's not completed
                onDragStart={handleDragStart} // Drag start handler
                onDragEnd={handleDragEnd} // Drag end handler
                style={{ border: '1px solid #ccc' }}
            >
                {/* Note details container */}
                <div className="d-flex justify-content-between align-items-center ">
                    <div className="form-check d-flex align-items-center w-100 gap-2">
                        {/* Checkbox to mark note as completed */}
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={note.isCompleted} // Reflect completion state
                            onChange={() => toggleComplete(note._id)} // Toggle completion state on change
                            id={`checkbox-${note._id}`}
                            style={{ border: '1px solid black' }}
                        />
                        {/* Label for the note title */}
                        <label
                            className={`form-check-label mb-0 ${note.isCompleted ? 'text-decoration-line-through' : ''}`} // Add strikethrough if completed
                            htmlFor={`checkbox-${note._id}`}
                        >
                            <strong>
                                {note.title.length > 5 ? `${note.title.slice(0, 5)}...` : note.title} {/* Truncate title if it's too long */}
                            </strong>
                        </label>
                    </div>
                    {/* Button to open the "Show Task" modal */}
                    <button
                        className="btn btn-link p-0"
                        onClick={handleShowTask}
                        title="Show task"
                    >
                        <img src="/eye-icon.svg" alt="Show" className="action-icon eye-icon" width="20" height="20" /> {/* Eye icon */}
                    </button>
                </div>
            </div>

            {/* Show Task Modal */}
            {showShowTaskModal && (
                <ShowTaskModal
                    note={note} // Pass the note details to the modal
                    onEdit={(editedNote) => updateNote(editedNote)} // Handle edit action
                    onDelete={async () => {
                        await deleteNote(note._id); // Delete the note
                        onDelete('Task deleted successfully'); // Notify parent about deletion
                    }}
                    onClose={() => setShowShowTaskModal(false)} // Close the modal
                />
            )}
        </>
    );
};

export default Noteitem;
