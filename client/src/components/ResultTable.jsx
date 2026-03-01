function ResultTable({ rows }) {
  if (!rows || rows.length === 0) {
    return <p className="status-text">No results found.</p>;
  }

  const headers = Object.keys(rows[0]);

  return (
    <div className="result-table">
      <table className="result-table__table">
        <thead className="result-table__head">
          <tr>
            {headers.map((header) => (
              <th key={header} className="result-table__th">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="result-table__body">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="result-table__row">
              {headers.map((header) => (
                <td key={header} className="result-table__td">
                  {row[header] !== null && row[header] !== undefined
                    ? String(row[header])
                    : "NULL"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultTable;
