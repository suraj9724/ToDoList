import { useState } from "react";
import Navbar from "./Navbar";
export default function Login() {
  const host = "http://localhost:5000"
  // Initialize state with an empty email and password
  const [creds, setCreds] = useState({ email: "", password: "" })
  // Use the useNavigate hook to navigate between pages
  // let history = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make a POST request to the /api/auth/login endpoint
    const response = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: creds.email, password: creds.password }), // body data type must match "Content-Type" header
    });
    const json = await response.json()
    console.log(json);
    if (json.success) {
      // console.log("Loginnnnnn")
      // Save the auth token and redirect to home page
      localStorage.setItem('token', json.authtoken);
      // history("/")
    }
    else {
      alert("Invalid credentials");
    }
  }
  const onChange = (e) => {
    // Update the state with the new value
    setCreds({ ...creds, [e.target.name]: e.target.value })
  }
  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
          <div className="col-md-4">
            <h2 className="text-center mb-4">Login</h2>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                name="email"
                value={creds.email}
                onChange={onChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={creds.password}
                onChange={onChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </div>
        </div>
      </form>
    </>
  );
}
