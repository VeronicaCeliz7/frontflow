type Props = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
};

export default function SuperStatsCard({ title, value, subtitle, icon }: Props) {
  return (
    <article className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-none transition hover:bg-gray-50 dark:hover:bg-gray-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
    </article>
  );
}