import { useMemo } from 'react';

interface Props {
    primary: number;
    headings: string[];
    rows: string[][];
};

const TableInterface = ({ primary, headings, rows }: Props) => {
    const key_prefix = `${headings[primary]}`;
    
    const table_headings = useMemo(() => headings.map(h => <th key={ `${key_prefix}_headings_${h}` }>{ h }</th>) , [headings]);
    const table_rows = useMemo(() =>
        rows.map((row) => {
            const row_key_prefix = `${key_prefix}_row_${row[primary]}`;
            const table_items = row.map( (item, index2) => <td key={ `${row_key_prefix}_item_${index2}` }>{ item }</td> );
            return <tr key={ row_key_prefix }>
                        { table_items }
                    </tr>;
        }
    ), [rows]);

    return (
        <table className="table">
            <thead>
                <tr key="ti_head">
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
