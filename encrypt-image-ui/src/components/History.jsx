export const History = () => {
  return (
    <div className="body h-full">
      <h1>History</h1>
      <div className="mt-4 h-5/6 overflow-auto">
        <table className="table-fixed w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="w-4/5 text-left py-2.5">File name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2.5 font-bold">
                hello
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
