import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const host = "http://localhost:5000"
  const [creds, setCreds] = useState({ email: "", password: "" })
  let history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: creds.email, password: creds.password }),
    });
    const json = await response.json()
    if (json.success) {
      localStorage.setItem('token', json.authtoken);
      history("/")
    }
    else {
      alert("Invalid credentials");
    }
  }

  const onChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value })
  }

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
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
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>
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
