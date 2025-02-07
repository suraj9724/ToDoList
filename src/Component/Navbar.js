import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AddNote from './AddNote'; // Import the AddNote component

const Navbar = () => {
  let location = useLocation(); // Get the current location
  let navigate = useNavigate(); // Hook to programmatically navigate
  const [showAddNoteModal, setShowAddNoteModal] = useState(false); // State to manage modal visibility

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/login'); // Redirect to login page
  }

  // Handle adding a new task
  const handleAddTask = () => {
    setShowAddNoteModal(true); // Show the AddNote modal
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">ToDo-List</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/' ? "active" : ""}`} aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/about' ? "active" : ""}`} to="/about">About</Link>
              </li>
            </ul>
            {!localStorage.getItem('token') ? (
              <form className="d-flex">
                <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
                <Link className="btn btn-primary mx-1" to="/signup" role="button">Signup</Link>
              </form>
            ) : (
              <div className="d-flex">
                <button onClick={handleAddTask} className='btn btn-primary mx-1'>Add Task</button>
                <button onClick={handleLogout} className='btn btn-primary'>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div style={{ height: '56px' }}></div>

      {/* Background Overlay */}
      {showAddNoteModal && <div className="modal-overlay" onClick={() => setShowAddNoteModal(false)}></div>}

      {/* AddNote Modal */}
      {showAddNoteModal && (
        <div className="modal" style={{ display: 'block' }}>
          <AddNote onClose={() => setShowAddNoteModal(false)} /> {/* Pass the onClose function */}
        </div>
      )}
    </>
  );
}

export default Navbar;
