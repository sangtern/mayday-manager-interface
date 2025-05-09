import { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext.tsx';

interface UserReg {
    email: string;
    name: string;
    password: string;
    role: string;
};

const Register = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        navigate("/");
    }

    const [ values, setValues ] = useState<UserReg>({
        email: "",
        name: "",
        password: "",
        role: ""
    });

    const handleChanges = (event: ChangeEvent) => {
        const target = event.target as HTMLTextAreaElement;
        setValues({ ...values, [target.name]: target.value });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        console.log("Registration values:", values);
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });
            response.json().then(res_data => {
                console.log(res_data);
                navigate("/login");
            });
        } catch(err) { console.error(err); }
    };

    return (
        <div className="d-flex vh-100 justify-content-center align-items-center bg-primary">
            <div className="p-3 bg-white w-25">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input type="email" className="form-control" placeholder="name@example.com" name="email" onChange={handleChanges} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" placeholder="Enter your name" name="name" onChange={handleChanges} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" placeholder="Enter your password here" name="password" onChange={handleChanges} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Account Type</label>
                        <select className="form-select" name="role" onChange={handleChanges}>
                            <option value="admin">Depot Admin</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="victim">Victim</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success form-control">Signup</button>
                </form>
                <p>Already have an account? <Link to="/login">Log in.</Link></p>
            </div>
        </div>
    );
};

export default Register;
