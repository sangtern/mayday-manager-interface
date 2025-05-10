import { useCallback, useMemo, MouseEvent } from "react";

import Pages from "../interfaces/Pages";
import { useAuth } from "./AuthContext";

interface Props {
    pages: Pages[];
    page: string;
    setPage: Function
};

const Navbar = ({ pages, page, setPage }: Props) => {
    const { user } = useAuth();

    const handleClick = useCallback((event: MouseEvent, new_page: string) => {
        event.preventDefault();
        console.log(`Clicked to ${new_page}`);
        setPage(new_page)
    }, []);

    const navlinks = useMemo(() => pages.map(p => {
        if (p.allowedRoles && user && p.allowedRoles.includes(user?.role)) {
            let name = p.name;
            return <a key={ "nav_" + name.toLowerCase() } className="nav-link" onClick={e => handleClick(e, name)} >
                    {name}
                </a>
        } else return null;
    }), [page])

/*    const navlinks = useMemo(() => pages.map(p => {
        let name = p.name;
        return <a key={ "nav_" + name } className="nav-link" aria-disabled={name === page ? "false": "true"} onClick={e => handleClick(e, name)}>
                { name.charAt(0).toUpperCase() + name.slice(1) }
            </a>
    }), [page]); */
    
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a key="maydaymanager" className="navbar-brand">Mayday Manager</a>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        {navlinks}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
