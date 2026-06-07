const rows = [
  ['#1842', 'Bache en avenida principal', 'Municipio Centro', 'En proceso', 'Alta'],
  ['#1841', 'Luminaria apagada', 'Municipio Norte', 'Pendiente', 'Media'],
  ['#1840', 'Basural urbano', 'Municipio Sur', 'Resuelto', 'Alta'],
  ['#1839', 'Semáforo dañado', 'Municipio Centro', 'En proceso', 'Crítica'],
];

export default function SuperIncidentsTable() {
  return (
    <section className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-none">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Incidentes recientes
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vista global de todos los clientes.
          </p>
        </div>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          Exportar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <th className="py-3">ID</th>
              <th>Título</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-gray-100 dark:border-gray-800">
                {row.map((cell, i) => (
                  <td key={i} className="py-4 text-gray-700 dark:text-gray-300">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}