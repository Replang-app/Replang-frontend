import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

/** Carte centrée pour les écrans d'auth. */
export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-8">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </main>
  );
}

/** Champ libellé + input. */
export function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-black/40 disabled:opacity-50 dark:border-white/15 dark:focus:border-white/40"
        {...props}
      />
    </label>
  );
}

export function Button({
  children,
  variant = "primary",
  loading,
  ...props
}: {
  variant?: "primary" | "secondary";
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      : "border border-black/15 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10";
  return (
    <button
      className={`${base} ${styles}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "…" : children}
    </button>
  );
}

/** Message d'erreur ou de succès. */
export function Alert({
  kind = "error",
  children,
}: {
  kind?: "error" | "success";
  children: ReactNode;
}) {
  const styles =
    kind === "error"
      ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
      : "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300";
  return (
    <p
      role={kind === "error" ? "alert" : "status"}
      className={`rounded-lg border px-3 py-2 text-sm ${styles}`}
    >
      {children}
    </p>
  );
}
