export default function SuperCharts() {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      {/* Gráfico de incidentes por mes */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-none">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Incidentes por mes
        </h3>
        <div className="mt-6 flex h-52 items-end gap-3">
          {[35, 48, 42, 60, 75, 58, 82, 95, 78, 88, 105, 120].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-blue-300 dark:from-blue-500 dark:to-blue-400"
                style={{ height: `${h}%` }}
              />
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de incidentes por estado */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-none">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Incidentes por estado
        </h3>

        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          {/* Donut circular */}
          <div className="h-44 w-44 rounded-full bg-[conic-gradient(#22c55e_0_55%,#f59e0b_55%_78%,#ef4444_78%_100%)] p-6">
            <div className="grid h-full w-full place-items-center rounded-full bg-white dark:bg-gray-900 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1.842</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
              </div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="h-3 w-3 rounded-full bg-green-500" /> Resueltos 55%
            </p>
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="h-3 w-3 rounded-full bg-yellow-500" /> En proceso 23%
            </p>
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="h-3 w-3 rounded-full bg-red-500" /> Pendientes 22%
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}