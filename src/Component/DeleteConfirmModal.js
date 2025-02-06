import React from 'react';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="modal-backdrop">
            <div className="delete-modal">
                <div className="modal-header">
                    <h5>Delete Task</h5>
                    <button className="close-btn" onClick={onCancel}>×</button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete this task?</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
