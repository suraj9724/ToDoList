import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  // Backend API URL
  const host = "http://localhost:5000"

  // State to store user credentials
  const [creds, setCreds] = useState({ email: "", password: "" })

  // Hook for programmatic navigation
  let history = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make API call to login endpoint
    const response = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: creds.email, password: creds.password }),
    });
    const json = await response.json()

    // If login successful, save token and redirect to home
    if (json.success) {
      localStorage.setItem('token', json.authtoken);
      history("/")
    }
    else {
      // Show error if credentials are invalid
      alert("Invalid credentials");
    }
  }

  // Handle input changes
  const onChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value })
  }

  return (
    // Container with full viewport height and light background
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="col-md-4">
        {/* Card with shadow for login form */}
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              {/* Email input field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  name="email"
                  value={creds.email}
                  onChange={onChange}
                  className="form-control"
                  required
                  autoComplete="email"
                />
              </div>
              {/* Password input field */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={creds.password}
                  onChange={onChange}
                  className="form-control"
                  required
                  autoComplete="current-password"
                />
              </div>
              {/* Login button */}
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>
              {/* Signup link section */}
              <div className="text-center">
                <p className="mb-2">Don't have an account?</p>
                <Link
                  to="/signup"
                  className="btn btn-outline-primary w-100"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
