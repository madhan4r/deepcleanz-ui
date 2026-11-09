/** DeepCleanz logo — Concept 2 "Home + sparkle" (spec D14). Original artwork. */
export function LogoIcon({ size = 32, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="64" height="64" rx="16" fill="#1C9BE6" />
      <path
        d="M14 31L32 16L50 31L50 49Q50 52 47 52L17 52Q14 52 14 49Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path
        transform="translate(24 30) scale(0.67)"
        d="M12 2C12.6 7.5 16.5 11.4 22 12C16.5 12.6 12.6 16.5 12 22C11.4 16.5 7.5 12.6 2 12C7.5 11.4 11.4 7.5 12 2Z"
        fill="#FFC233"
      />
    </svg>
  )
}

export function Logo() {
  return (
    <a href="/" className="logo" aria-label="DeepCleanz home">
      <LogoIcon />
      <span aria-hidden="true" style={{ color: 'var(--ink)' }}>
        Deep<span>Cleanz</span>
      </span>
    </a>
  )
}
