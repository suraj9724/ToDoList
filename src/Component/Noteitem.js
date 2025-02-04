import React, { useContext } from 'react'
import noteContext from '../context/notecontext'
import './Noteitem.css'

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote, toggleComplete } = context;
    const { note, updateNote } = props;

    const formatDate = (dateString) => {
        try {
            const dateToFormat = dateString || note.createdAt;
            if (!dateToFormat) return 'Date not available';
            const date = new Date(dateToFormat);
            if (isNaN(date.getTime())) return 'Date not available';
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            return date.toLocaleString(undefined, options);
        } catch (error) {
            return 'Date not available';
        }
    };

    return (
        <div className='col-md-4 col-lg-3 mb-4'>
            <div className={`card h-100 shadow-sm ${note.isCompleted ? 'bg-light border-success' : 'border-primary'}`}>
                <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={note.isCompleted}
                            onChange={() => toggleComplete(note._id)}
                            id={`checkbox-${note._id}`}
                        />
                        <label
                            className="form-check-label text-muted"
                            htmlFor={`checkbox-${note._id}`}
                        >
                            {note.isCompleted ? 'Completed' : 'Mark Complete'}
                        </label>
                    </div>
                    <div className="actions">
                        <button className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => updateNote(note)}
                            title='Edit note'>
                            <img src="/edit-icon.png"
                                alt="Edit"
                                className='edit-icon'
                                width="20"
                                height="20"
                            />
                        </button>
                        <button
                            className="btn btn-sm btn-link p-0 delete-btn"
                            onClick={() => deleteNote(note._id)}
                            title="Delete note"
                        >
                            <img
                                src="/delete-icon.png"
                                alt="Delete"
                                className="delete-icon"
                                width="20"
                                height="20"
                            />
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <h5 className={`card-title ${note.isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>
                        {note.title}
                    </h5>
                    <p className={`card-text ${note.isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>
                        {note.description}
                    </p>
                </div>
                <div className="card-footer bg-transparent text-muted small">
                    <i className="far fa-clock me-1"></i>
                    {formatDate(note.date || note.createdAt)}
                </div>
            </div>
        </div>
    )
}

export default Noteitem
