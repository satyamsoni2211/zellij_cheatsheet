interface SectionHeaderProps {
  title: string
  description: string
  id: string
}

export function SectionHeader({ title, description, id }: SectionHeaderProps) {
  return (
    <div className="mb-8 scroll-mt-20" id={id}>
      {/* Anchor link */}
      <a
        href={`#${id}`}
        className="absolute -mt-20 opacity-0 pointer-events-none focus:opacity-100 focus:pointer-events-auto"
        tabIndex={0}
      >
        Link
      </a>

      <h2 className="text-2xl font-mono font-bold text-[var(--text-primary)] mb-2">
        {title}
      </h2>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  )
}