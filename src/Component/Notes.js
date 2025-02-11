import React, { useState, useContext, useEffect } from 'react';
import noteContext from '../context/notecontext';
import Noteitem from './Noteitem';
import './Notes.css';

const Notes = () => {
    const context = useContext(noteContext); // Accessing the note context
    const { notes, getNotes, editNote } = context; // Destructuring functions and state from context
    const [selectedDate, setSelectedDate] = useState(new Date()); // State to track the selected date
    const [showWeekends, setShowWeekends] = useState(true); // State to toggle weekend visibility
    const [dragError, setDragError] = useState(''); // State to display drag-and-drop error messages
    const [deleteAlert, setDeleteAlert] = useState(''); // State to display deletion alert messages
    const [dragging, setDragging] = useState(false); // State to track drag-and-drop activity
    const [isEdgeTransitioning, setIsEdgeTransitioning] = useState(false); // Lock mechanism to prevent rapid week transitions

    // Fetch notes when the component mounts and token exists in local storage
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        }
    }, [getNotes]);

    // Add and remove the drag-over-edge event listener based on drag activity
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

    // Utility function to calculate the start of the week for a given date
    const getStartOfWeek = (date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust for weeks starting on Monday
        start.setDate(diff);
        return start;
    };

    const startOfWeek = getStartOfWeek(selectedDate); // Calculate the current week's start date

    // Navigate to the previous week
    const handlePrevWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 7);
        setSelectedDate(newDate);
    };

    // Navigate to the next week
    const handleNextWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 7);
        setSelectedDate(newDate);
    };

    // Toggle the visibility of weekend days
    const toggleWeekends = () => {
        setShowWeekends(!showWeekends);
    };

    // Handle drag-over events for a specific day card
    const handleDragOver = (e, day) => {
        e.preventDefault();
        e.target.classList.add('drag-over'); // Add a visual indicator for drag-over
    };

    // Handle when a dragged item leaves a day card
    const handleDragLeave = (e) => {
        e.target.classList.remove('drag-over'); // Remove the drag-over visual indicator
    };

    // Handle dropping a task onto a day card
    const handleDrop = (e, day) => {
        e.preventDefault();
        e.target.classList.remove('drag-over'); // Remove the drag-over indicator
        const currentDate = new Date();
        if (day < currentDate.setHours(0, 0, 0, 0)) { // Prevent dragging tasks into past dates
            setDragError('You cannot drag tasks into the past.');
            setTimeout(() => setDragError(''), 2000); // Clear the error message after 2 seconds
            return;
        }
        try {
            const noteData = JSON.parse(e.dataTransfer.getData('noteData')); // Parse the note data from drag event
            if (!noteData) { // Handle invalid drag operations
                setDragError('Invalid drag operation.');
                setTimeout(() => setDragError(''), 2000);
                return;
            }
            const updatedNote = { ...noteData, dueDate: day.toISOString() }; // Update the note's due date
            editNote(noteData._id, updatedNote); // Save the updated note
        } catch (error) {
            console.error(error.message); // Log errors to the console
        }
    };

    // Debounce function to limit the frequency of edge drag handling
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    // Handle dragging over the edges of the calendar to navigate between weeks
    const handleDragOverEdge = debounce((e) => {
        const edgeThreshold = 50; // Pixels from the edge to trigger a week transition
        const { clientX } = e;
        if (isEdgeTransitioning) {
            return; // Prevent multiple triggers during the lock
        }
        if (clientX <= edgeThreshold) { // Left edge - navigate to previous week
            setIsEdgeTransitioning(true);
            handlePrevWeek();
            setTimeout(() => setIsEdgeTransitioning(false), 500); // Lock for 500ms
        } else if (window.innerWidth - clientX <= edgeThreshold) { // Right edge - navigate to next week
            setIsEdgeTransitioning(true);
            handleNextWeek();
            setTimeout(() => setIsEdgeTransitioning(false), 500); // Lock for 500ms
        }
    }, 200); // Debounce delay of 200ms

    // Set dragging state when a drag operation starts
    const handleDragStart = () => {
        setDragging(true);
    };

    // Reset dragging state and transition lock when drag operation ends
    const handleDragEnd = () => {
        setDragging(false);
        setIsEdgeTransitioning(false); // Reset the lock
    };

    return (
        <>
            <div className="calendar-container" onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {/* Header Section */}
                <div className="calendar-header">
                    <div className="d-flex gap-2">
                        <button className="nav-button" onClick={handlePrevWeek}>&lt;</button> {/* Previous week button */}
                        <button className="nav-button" onClick={handleNextWeek}>&gt;</button> {/* Next week button */}
                    </div>
                    <h2>{startOfWeek.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2> {/* Current month/year */}
                    <button className="nav-button" onClick={toggleWeekends}>
                        {showWeekends ? 'Hide Weekends' : 'Show Weekends'} {/* Toggle weekends button */}
                    </button>
                </div>

                {/* Alert Messages */}
                {dragError && <div className="alert alert-warning" role="alert">{dragError}</div>} {/* Drag error message */}
                {deleteAlert && <div className="alert alert-danger" role="alert">{deleteAlert}</div>} {/* Deletion alert message */}

                {/* Calendar Grid */}
                <div className="calendar-grid">
                    {Array.from({ length: 7 }).map((_, index) => {
                        const day = new Date(startOfWeek);
                        day.setDate(day.getDate() + index); // Calculate the current day in the week

                        const filteredNotes = notes.filter(note => {
                            const noteDate = new Date(note.dueDate);
                            return noteDate.toDateString() === day.toDateString(); // Filter notes by day
                        });

                        // Skip rendering weekend days if weekends are hidden
                        if (!showWeekends && (day.getDay() === 0 || day.getDay() === 6)) {
                            return null;
                        }

                        return (
                            <div
                                key={index}
                                className="day-card"
                                onDragOver={(e) => handleDragOver(e, day)} // Handle drag-over event
                                onDragLeave={handleDragLeave} // Handle drag-leave event
                                onDrop={(e) => handleDrop(e, day)} // Handle drop event
                            >
                                <div className="p-3 border rounded bg-light">
                                    <h5 className="mb-1">{day.toLocaleString('en-US', { weekday: 'short' })}</h5> {/* Day of the week */}
                                    <p className="mb-0">{day.getDate()}</p> {/* Day of the month */}

                                    {filteredNotes.length === 0 ? (
                                        <p className="text-muted text-center flex-grow">No tasks</p>
                                    ) : (
                                        <div className={`tasks-container ${filteredNotes.length >= 4 ? 'scrollable' : ''}`}> {/* Task container */}
                                            {filteredNotes.map(note => (
                                                <Noteitem
                                                    key={note._id}
                                                    note={note}
                                                    updateNote={(note) => editNote(note._id, {
                                                        description: note.description,
                                                        dueDate: note.dueDate
                                                    })} // Update note handler
                                                    onDelete={(message) => setDeleteAlert(message)} // Deletion alert handler
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Notes;
