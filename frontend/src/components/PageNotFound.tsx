import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

const PageNotFound = () => {
    return (
        <div className="d-flex vh-100 justify-content-center align-items-center bg-warning-subtle">
            <div className="p-3 w-25">
                <h1>Page Not Found</h1>
                <Link to={"/login"}>
                    <button className="btn btn-primary">Have You Logged In?</button>
                </Link>
            </div>
        </div>
    );
};

export default PageNotFound;
