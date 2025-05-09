import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from './AuthContext.tsx';

import 'bootstrap/dist/css/bootstrap.css';

const Login = () => {
    const navigate = useNavigate();
    
    const { user, setUser, isLoggedIn, setLoggedIn } = useAuth();

    const [ userLogin, setUserLogin ] = useState<string>("");
    const [ pass, setPass ] = useState<string>("");

    if (isLoggedIn) {
        navigate("/dashboard");
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: userLogin,
                password: pass
            })
        })
        .then(response => response.json())
        .then(data => {
            setLoggedIn(true);
            setUser({
                ...user,
                email: data.email,
                name: data.name,
                role: data.role
            });
            navigate("/dashboard");
        })
        .catch(err => console.error(err));
    };

    return (
        <div className="d-flex vh-100 justify-content-center align-items-center bg-primary">
            <div className="p-3 bg-white w-25">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" placeholder="Enter Email" className="form-control" onChange={ e => setUserLogin(e.target.value) } />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" placeholder="Enter Passwrd" className="form-control" onChange={ e => setPass(e.target.value) } />
                    </div>

                    <button type="submit" className="btn btn-info">Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Create one here.</Link></p>
            </div>
        </div>
    );
};

export default Login;
