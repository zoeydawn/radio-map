import { Theme } from '@/context/AppContext.types'

export const externalLinkClass = (theme: Theme) =>
  `${'link link-hover flex items-center pt-1 pb-1'} ${theme === 'dark' ? 'link-accent' : 'link-neutral'}`

interface ExternalLinkProps {
  href: string
  rel: string
  label: string
  theme: Theme
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  rel,
  label,
  theme,
}) => {
  return (
    <a
      className={externalLinkClass(theme)}
      target="_blank"
      href={href}
      rel={rel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        />
      </svg>{' '}
      {label}
    </a>
  )
}

export default ExternalLink
