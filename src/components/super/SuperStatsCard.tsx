type Props = {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
};

export default function SuperStatsCard({ title, value, subtitle, icon }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{value}</h3>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl dark:bg-violet-950">
          {icon}
        </div>
      </div>
    </article>
  );
}