import { useState, useEffect, useMemo } from 'react';

import Navbar from './components/Navbar.tsx';
import TableInterface from './components/TableInterface.tsx';
import 'bootstrap/dist/css/bootstrap.css';

function getPrimaryFromName(name: string) {
    for(let i = 0; i < pages.length; i++) {
        if (pages[i].name === name) {
            return pages[i].key_index;
        }
    }
    return 0;
}

const pages = [
    {name: "users", key_index: 0},
    {name: "volunteers", key_index: 0},
    {name: "victims", key_index: 0},
    {name: "depotadmins", key_index: 0},
    {name: "products", key_index: 3}
];

const App = () => {
    const [ page, setPage ] = useState<string>("users");
    const [ data, setData ] = useState<Array<Object>>([]);

    useEffect(() => {
        console.log("Page value:", page);
        fetch(`http://localhost:8081/${page}`)
            .then(res => res.json())
            .then(res_data => setData(res_data))
            .catch(err => console.error(err));
    }, [page]);
    
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

export default App;
