import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import Navbar from "./Navbar";
const Sign = () => {
    // let history = useNavigate();
    const host = "http://localhost:5000"
    const [creds, setCreds] = useState({ name: "", email: "", password: "", confirmPassword: "" })
    const [passwordError, setPasswordError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (creds.password.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }
        if (creds.password !== creds.confirmPassword) {
            setPasswordError("Passwords do not match!");
            return;
        }
        try {
            const response = await fetch(`${host}/api/auth/createuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: creds.name, email: creds.email, password: creds.password }),
            });
            const json = await response.json();
            console.log(json);
        } catch (error) {
            console.error("Error:", error);
            setPasswordError("Something went wrong! Please try again.");
        }
    }

    const onChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value })
        if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
            setPasswordError("")
        }
    }

    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
                    {/* <h1>Welcome to todoList</h1> */}
                    <div className="col-md-4">
                        <div className="text-center mb-4">
                            <h2>Sign Up</h2>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="name" className="form-control" id="name" name="name" value={creds.name} onChange={onChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" name="email" value={creds.email} onChange={onChange} aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" value={creds.password} name="password" id="password" onChange={onChange} minLength={8} />
                            <small className="text-muted">Password must be at least 8 characters long</small>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" value={creds.confirmPassword} name="confirmPassword" id="confirmPassword" onChange={onChange} />
                            {passwordError && <div className="text-danger">{passwordError}</div>}
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Sign;