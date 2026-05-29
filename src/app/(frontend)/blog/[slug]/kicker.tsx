interface BlogKickerProps {
  trackNumber?: number | null
  publishedDate?: string | null
}

export function BlogKicker({ trackNumber, publishedDate }: BlogKickerProps) {
  if (!publishedDate) {
    return null
  }

  const formattedDate = new Date(publishedDate).toISOString().split('T')[0]

  const text =
    trackNumber != null
      ? `Track ${String(trackNumber).padStart(2, '0')} · ${formattedDate}`
      : formattedDate

  return (
    <p className="font-mono text-[0.72rem] uppercase tracking-widest text-accent mb-3">{text}</p>
  )
}
