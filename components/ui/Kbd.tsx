interface KbdProps {
  keys: string[]
  className?: string
}

export function Kbd({ keys, className = '' }: KbdProps) {
  return (
    <kbd
      className={`inline-flex items-center justify-center px-2 py-1
        bg-[var(--kbd-bg)] text-[var(--kbd-text)] text-xs font-mono
        border border-[var(--kbd-border)] rounded
        shadow-sm select-none ${className}`}
    >
      {keys.map((key, index) => (
        <span key={index} className="inline-flex items-center">
          {index > 0 && (
            <span className="mx-1 text-[var(--text-secondary)]">+</span>
          )}
          {key}
        </span>
      ))}
    </kbd>
  )
}