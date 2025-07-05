import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Register from './components/Register.tsx';
import Dashboard from './components/Dashboard.tsx';
import Login from './components/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import PageNotFound from './components/PageNotFound.tsx';

import 'bootstrap/dist/css/bootstrap.css';
import { useAuth } from './components/AuthContext.tsx';

const App = () => {
    const { user } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={['admin', 'volunteer', 'victim']}>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                <Route path="/" element={
                    !user ? <Navigate to="/login" /> : <Navigate to="/dashboard" />
                } />

                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );

/*    return (
        <>
           <Navbar pages={pages} page={page} setPage={setPage} />
           <div className="container-lg" id="table-container">
               { data.length > 0 ? <TableInterface primary={getPrimaryFromName(page)} headings={headings} rows={rows} /> : <p>No data</p> }
           </div>
        </>
    ); */
};

export default App;
