import React, { useState, useContext, useEffect } from 'react';
import noteContext from '../context/notecontext';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import './Notes.css';

const Notes = () => {
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showWeekends, setShowWeekends] = useState(true);
    const [dragError, setDragError] = useState('');
    const [deleteAlert, setDeleteAlert] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        }
    }, []);

    const getStartOfWeek = (date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        return start;
    };

    const startOfWeek = getStartOfWeek(selectedDate);

    const handlePrevWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 7);
        setSelectedDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 7);
        setSelectedDate(newDate);
    };

    const toggleWeekends = () => {
        setShowWeekends(!showWeekends);
    };

    const handleDragOver = (e, targetDate) => {
        e.preventDefault();
        const column = e.currentTarget;

        // Only validate that target date is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (targetDate < today) {
            column.classList.add('drag-over-invalid');
            setDragError('Cannot move tasks to past dates');
            return;
        }
        column.classList.add('drag-over');
        setDragError('');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
        e.currentTarget.classList.remove('drag-over-invalid');
        setDragError('');
    };

    const handleDrop = async (e, targetDate) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        e.currentTarget.classList.remove('drag-over-invalid');

        try {
            const noteId = e.dataTransfer.getData('noteId');
            const noteData = JSON.parse(e.dataTransfer.getData('noteData'));

            // Only validate that target date is in the future
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (targetDate < today) {
                setDragError('Cannot move tasks to past dates');
                return;
            }

            // Only allow dragging incomplete tasks
            if (noteData.isCompleted) {
                setDragError('Cannot move completed tasks');
                return;
            }

            // Format target date as YYYY-MM-DD
            const formattedDate = targetDate.toISOString().split('T')[0];

            // First delete the note from its current position
            await context.deleteNote(noteId);

            // Then create a new note at the target date
            await context.addNote(noteData.description, formattedDate);
            // Refresh notes to show the updated state
            await getNotes();
            
            setDragError('');

            setDragError('');

        } catch (error) {
            console.error('Error in handleDrop:', error);
            setDragError('Error moving task. Please try again.');
            // Refresh notes to ensure UI is in sync
            await getNotes();
        }
    };

    const handleDelete = (message) => {
        setDeleteAlert(message);
        setTimeout(() => {
            setDeleteAlert('');
        }, 3000);
    };

    return (
        <div className="calendar-container">
            <AddNote />

            <div className="calendar-header">
                <div className="nav-buttons">
                    <button className="nav-button" onClick={handlePrevWeek}>
                        Previous Week
                    </button>
                    <button className="nav-button" onClick={handleNextWeek}>
                        Next Week
                    </button>
                </div>
                <h2>{startOfWeek.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button className="weekend-toggle" onClick={toggleWeekends}>
                    {showWeekends ? 'Hide Weekends' : 'Show Weekends'}
                </button>
            </div>

            {dragError && (
                <div className="alert alert-warning mb-3" role="alert">
                    {dragError}
                </div>
            )}

            {deleteAlert && (
                <div className="alert alert-danger mb-3" role="alert">
                    {deleteAlert}
                </div>
            )}

            <div
                className="calendar-grid"
                style={{
                    gridTemplateColumns: `repeat(${showWeekends ? 7 : 5}, 1fr)`
                }}
            >
                {Array.from({ length: 7 }).map((_, index) => {
                    const day = new Date(startOfWeek);
                    day.setDate(day.getDate() + index);
                    const filteredNotes = notes.filter(note => {
                        const noteDate = new Date(note.dueDate);
                        return noteDate.toDateString() === day.toDateString();
                    });

                    if (!showWeekends && (day.getDay() === 0 || day.getDay() === 6)) {
                        return null;
                    }

                    return (
                        <div
                            key={index}
                            className="day-column"
                            onDragOver={(e) => handleDragOver(e, day)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, day)}
                        >
                            <div className="day-header">
                                <h5 className="mb-1">
                                    {day.toLocaleString('en-US', { weekday: 'short' })}
                                </h5>
                                <p className="mb-0">{day.getDate()}</p>
                            </div>
                            {filteredNotes.length === 0 ? (
                                <p className="empty-day">No tasks</p>
                            ) : (
                                filteredNotes.map(note => (
                                    <Noteitem
                                        key={note._id}
                                        note={note}
                                        updateNote={(note) => editNote(note._id, {
                                            description: note.description,
                                            dueDate: note.dueDate
                                        })}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Notes;