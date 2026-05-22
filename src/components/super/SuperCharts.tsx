export default function SuperCharts() {
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          Incidentes por mes
        </h3>
        <div className="mt-6 flex h-52 items-end gap-3">
          {[35, 48, 42, 60, 75, 58, 82, 95, 78, 88, 105, 120].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-violet-700 to-violet-300"
                style={{ height: `${h}%` }}
              />
              <span className="text-[10px] text-slate-400">
                {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          Incidentes por estado
        </h3>

        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <div className="h-44 w-44 rounded-full bg-[conic-gradient(#16a34a_0_55%,#f59e0b_55%_78%,#ef4444_78%_100%)] p-6">
            <div className="grid h-full w-full place-items-center rounded-full bg-white text-center dark:bg-slate-900">
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">1.842</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className="h-3 w-3 rounded-full bg-green-600" /> Resueltos 55%
            </p>
            <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className="h-3 w-3 rounded-full bg-amber-500" /> En proceso 23%
            </p>
            <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className="h-3 w-3 rounded-full bg-red-500" /> Pendientes 22%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}