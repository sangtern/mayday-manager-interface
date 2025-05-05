interface Props {
    primary: number;
    headings: string[];
    rows: Array<string>[];
};

const TableInterface = ({ primary, headings, rows }: Props) => {
    const table_headings = headings.map( h => <th>{h}</th> );


    const table_rows = rows.map((r) => {
        const table_items = r.map( i => <td>{i}</td> );
        return (<tr>{table_items}</tr>);
    });

    return (
        <table className="table">
            <thead>
                <tr>
                    {table_headings}
                </tr>
            </thead>
            <tbody>
                {table_rows}
            </tbody>
        </table>
    );
};

export default TableInterface;
