import { Pages } from "../interfaces/Pages";

interface Props {
    pages: Pages[];
    page: string;
    setPage: Function
};

const Navbar = ({ pages, page, setPage }: Props) => {
    const navlinks = pages.map(p => {
        let name = p.name;
        return (
            <a key={"nav_" + name} className={name === page ? "nav-link" : "nav-link disabled"}>
                { name.charAt(0).toUpperCase() + name.slice(1) }
            </a>
        );
    });

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Mayday Manager</a>
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
