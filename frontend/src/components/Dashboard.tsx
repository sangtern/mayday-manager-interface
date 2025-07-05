import { useState, useEffect, useMemo } from 'react';

import Navbar from "./Navbar";
import TableInterface from "./TableInterface";
import { useAuth } from './AuthContext';

function getPrimaryFromName(name: string) {
    for(let i = 0; i < pages.length; i++) {
        if (pages[i].name === name) {
            return pages[i].key_index;
        }
    }
    return 0;
}

const pages = [
    { name: "Relief Requests", api: "reliefrequests", key_index: 0, allowedRoles: [ "volunteer", "victim", "admin" ] },
    { name: "Products", api: "products", key_index: 0, allowedRoles: [ "volunteer", "admin" ] },
    { name: "Depots", api: "depots", key_index: 0, allowedRoles: [ "admin" ] },
    { name: "Volunteers", api: "volunteers", key_index: 0, allowedRoles: [ "admin" ] },
    { name: "Victims", api: "victims", key_index: 0, allowedRoles: [ "admin" ] }
];

const Dashboard = () => {
    const { user } = useAuth();

    const [ page, setPage ] = useState<string>("Relief Requests");
    const [ data, setData ] = useState<Array<Object>>([]);

    const api = useMemo(() => {
        for(let i = 0; i < pages.length; i++) {
            const pp = pages[i];
            if (pp.name === page) {
                return pp.api;
            }
        }
        return "reliefrequests";
    }, [page]);

    useEffect(() => {
        console.log("Dashboard: page changed! New page:", page);

        console.log("Passing the following api:", api);
        fetch(`http://localhost:8081/${api}/${user?.role || "victim"}/${user?.email}`)
            .then(res => res.json())
            .then(res_data => setData(res_data))
            .catch(err => console.error(err));
    }, [page, api]);

    console.log(data);
    
    const headings = useMemo(() => data.length > 0 ? Object.keys(data[0]) : [], [data]);
    const rows = useMemo(() => data.map( d => Object.values(d).map(i => i ? i.toString() : null) ), [data]);
    
    return (
        <>
           <Navbar pages={pages} page={page} setPage={setPage} />
           <div className="container-lg" id="table-container">
               { data.length > 0 ? <TableInterface primary={getPrimaryFromName(page)} headings={headings} rows={rows} /> : <p>No data</p> }
           </div>
        </>
    );
};

export default Dashboard;
