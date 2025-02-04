import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    const [passwordError, setPasswordError] = useState("")
    const navigate = useNavigate();
    const host = "http://localhost:5000"

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = credentials;

        // Check if passwords match before submitting
        if (password !== cpassword) {
            setPasswordError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${host}/api/auth/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const json = await response.json();
            // console.log('Server response:', json); // For debugging

            if (json.authtoken) {  // Check for authtoken instead of success
                // Clear form
                setCredentials({ name: "", email: "", password: "", cpassword: "" });
                // Show success message
                alert("Account created successfully! Please login.");
                // Redirect to login page
                navigate('/login', { replace: true });
            } else {
                // Show specific error message from server if available
                alert(json.error || "Failed to create account. Please try again.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred while signing up. Please try again.");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
        // Clear password error when user types in either password field
        if (e.target.name === 'password' || e.target.name === 'cpassword') {
            setPasswordError("");
        }
    }

    // Check passwords match on blur of confirm password field
    const handleConfirmPasswordBlur = () => {
        if (credentials.password !== credentials.cpassword && credentials.cpassword !== "") {
            setPasswordError("Passwords do not match!");
        } else {
            setPasswordError("");
        }
    }

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="col-md-4">
                <div className="card shadow-sm">
                    <div className="card-body p-4">
                        <h2 className="text-center mb-4">Create Account</h2>
                        <form onSubmit={handleSubmit}>
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
                            <button
                                type="submit"
                                className="btn btn-primary w-100 mb-3"
                            >
                                Sign Up
                            </button>
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