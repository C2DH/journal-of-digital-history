type TableProps = {
  headers: string[]
  data: (string | number)[][]
}

const Table = ({ headers, data }: TableProps) => (
  <table className="card-table">
    <thead>
      <tr>
        {headers.map((header, idx) => (
          <th key={idx}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rIdx) => (
        <tr key={rIdx}>
          {row.map((cell, cIdx) => (
            <td key={cIdx}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)

export default Table