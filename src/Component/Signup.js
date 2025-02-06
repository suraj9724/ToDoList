import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    // State for form data and validation
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    const [passwordError, setPasswordError] = useState("")

    // Navigation hook
    const navigate = useNavigate();

    // Backend API URL
    const host = "http://localhost:5000"

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = credentials;

        // Validate password match
        if (password !== cpassword) {
            setPasswordError("Passwords do not match!");
            return;
        }

        try {
            // Make API call to create user
            const response = await fetch(`${host}/api/auth/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const json = await response.json();

            // Handle successful signup
            if (json.authtoken) {
                // Clear form
                setCredentials({ name: "", email: "", password: "", cpassword: "" });
                // Show success message and redirect
                alert("Account created successfully! Please login.");
                navigate('/login', { replace: true });
            } else {
                // Show error message
                alert(json.error || "Failed to create account. Please try again.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred while signing up. Please try again.");
        }
    }

    // Handle input changes
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
        // Clear password error when user types in password fields
        if (e.target.name === 'password' || e.target.name === 'cpassword') {
            setPasswordError("");
        }
    }

    // Validate password match on blur
    const handleConfirmPasswordBlur = () => {
        if (credentials.password !== credentials.cpassword && credentials.cpassword !== "") {
            setPasswordError("Passwords do not match!");
        } else {
            setPasswordError("");
        }
    }

    return (
        // Main container with full viewport height
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="col-md-4">
                {/* Signup form card */}
                <div className="card shadow-sm">
                    <div className="card-body p-4">
                        <h2 className="text-center mb-4">Create Account</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Name input field */}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    onChange={onChange}
                                    placeholder="Enter your name"
                                    required
                                    minLength={3}
                                />
                            </div>
                            {/* Email input field */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    onChange={onChange}
                                    placeholder="Enter your email"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            {/* Password input field */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    onChange={onChange}
                                    placeholder="Create a password"
                                    required
                                    minLength={5}
                                    autoComplete="new-password"
                                />
                            </div>
                            {/* Confirm password field with validation */}
                            <div className="mb-3">
                                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                    id="cpassword"
                                    name="cpassword"
                                    onChange={onChange}
                                    onBlur={handleConfirmPasswordBlur}
                                    placeholder="Confirm your password"
                                    required
                                    minLength={5}
                                    autoComplete="new-password"
                                />
                                {passwordError &&
                                    <div className="invalid-feedback">
                                        {passwordError}
                                    </div>
                                }
                            </div>
                            {/* Submit button */}
                            <button
                                type="submit"
                                className="btn btn-primary w-100 mb-3"
                            >
                                Sign Up
                            </button>
                            {/* Login link section */}
                            <div className="text-center">
                                <p className="mb-2">Already have an account?</p>
                                <Link
                                    to="/login"
                                    className="btn btn-outline-primary w-100"
                                >
                                    Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup