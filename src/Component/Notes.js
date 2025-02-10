import React, { useState, useContext, useEffect } from 'react';
import noteContext from '../context/notecontext';
import Noteitem from './Noteitem';
import './Notes.css';

const Notes = () => {
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showWeekends, setShowWeekends] = useState(true);
    const [dragError, setDragError] = useState('');
    const [deleteAlert, setDeleteAlert] = useState('');
    const [dragging, setDragging] = useState(false);
    const [isEdgeTransitioning, setIsEdgeTransitioning] = useState(false); // Lock mechanism

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        }
    }, [getNotes]);

    useEffect(() => {
        if (dragging) {
            document.addEventListener('dragover', handleDragOverEdge);
        } else {
            document.removeEventListener('dragover', handleDragOverEdge);
        }
        return () => {
            document.removeEventListener('dragover', handleDragOverEdge);
        };
        // eslint-disable-next-line 
    }, [dragging]);

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

    const handleDragOver = (e, day) => {
        e.preventDefault();
        e.target.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.target.classList.remove('drag-over');
    };

    const handleDrop = (e, day) => {
        e.preventDefault();
        e.target.classList.remove('drag-over');
        const currentDate = new Date();
        if (day < currentDate.setHours(0, 0, 0, 0)) {
            setDragError('You cannot drag tasks into the past.');
            setTimeout(() => setDragError(''), 2000);
            return;
        }
        try {

            const noteData = JSON.parse(e.dataTransfer.getData('noteData'));
            if (!noteData) {
                setDragError('Invalid drag operation.');
                setTimeout(() => setDragError(''), 2000);
                return;
            }
            const updatedNote = { ...noteData, dueDate: day.toISOString() };
            editNote(noteData._id, updatedNote);
        } catch (error) {
            console.error(error.message);

        }
    };

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const handleDragOverEdge = debounce((e) => {
        const edgeThreshold = 50; // Pixels from the edge
        const { clientX } = e;
        if (isEdgeTransitioning) {
            return; // Prevent multiple triggers during transition
        }
        if (clientX <= edgeThreshold) {
            // Left edge - go to previous week
            setIsEdgeTransitioning(true);
            handlePrevWeek();
            setTimeout(() => setIsEdgeTransitioning(false), 500); // Lock for 500ms
        } else if (window.innerWidth - clientX <= edgeThreshold) {
            // Right edge - go to next week
            setIsEdgeTransitioning(true);
            handleNextWeek();
            setTimeout(() => setIsEdgeTransitioning(false), 500); // Lock for 500ms
        }
    }, 200); // Debounced by 200ms

    const handleDragStart = () => {
        setDragging(true);
    };

    const handleDragEnd = () => {
        setDragging(false);
        setIsEdgeTransitioning(false); // Reset the lock when dragging ends
    };

    return (
        <div className="container mt-4" onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {/* Header Section */}
            <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary" onClick={handlePrevWeek}>
                        &lt;
                    </button>
                    <button className="btn btn-outline-primary" onClick={handleNextWeek}>
                        &gt;
                    </button>
                </div>

                <h2 className="text-center">
                    {startOfWeek.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>

                <button className="btn btn-outline-primary" onClick={toggleWeekends}>
                    {showWeekends ? 'Hide Weekends' : 'Show Weekends'}
                </button>
            </div>

            {/* Alert Messages */}
            {dragError && (
                <div className="alert alert-warning" role="alert">
                    {dragError}
                </div>
            )}
            {deleteAlert && (
                <div className="alert alert-danger" role="alert">
                    {deleteAlert}
                </div>
            )}

            {/* Calendar Grid */}
            <div className="calendar-grid">
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
                            className="day-card"
                            onDragOver={(e) => handleDragOver(e, day)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, day)}
                        >
                            <h5 className="mb-1">
                                {day.toLocaleString('en-US', { weekday: 'short' })}
                            </h5>
                            <p className="mb-0">{day.getDate()}</p>

                            {filteredNotes.length === 0 ? (
                                <p className="text-muted text-center">No tasks</p>
                            ) : (
                                filteredNotes.map(note => (
                                    <Noteitem
                                        key={note._id}
                                        note={note}
                                        updateNote={(note) =>
                                            editNote(note._id, {
                                                description: note.description,
                                                dueDate: note.dueDate
                                            })
                                        }
                                        onDelete={(message) => setDeleteAlert(message)}
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