/** En-tête de page aligné sur les hiérarchies typographiques Lumis (micro-label uppercase + titre). */
export function PageHeader({
  label,
  title,
  description,
}: {
  label?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      {label ? (
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--lumis-text-dim)]">
          {label}
        </p>
      ) : null}
      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--lumis-text-dim)]">{description}</p>
      ) : null}
    </div>
  );
}
