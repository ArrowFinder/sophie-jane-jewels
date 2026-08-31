type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8h12l-.8 12.2a1 1 0 0 1-1 .8H7.8a1 1 0 0 1-1-.9Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function PinterestIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 20c-.5-1.5 0-3 .5-5 .3-1.2 1-4 1-4a2.4 2.4 0 0 1-.2-1c0-1 .6-1.8 1.3-1.8.6 0 .9.5.9 1 0 .7-.5 1.7-.7 2.6-.2.8.4 1.5 1.2 1.5 1.4 0 2.5-1.5 2.5-3.6 0-1.9-1.4-3.2-3.3-3.2-2.3 0-3.6 1.7-3.6 3.4 0 .7.2 1.2.6 1.6.1.2.2.3.1.5l-.2.8c0 .2-.2.3-.4.2-1.1-.5-1.7-1.8-1.7-3.1C7.3 6.9 9 5 12.3 5c2.7 0 4.7 1.9 4.7 4.5 0 2.7-1.7 4.8-4 4.8-.8 0-1.6-.4-1.8-.9l-.5 1.9c-.2.7-.6 1.6-1 2.3" />
    </svg>
  );
}

export function DiamondMark(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.2} {...props}>
      <path d="M12 3 21 9 12 21 3 9Z" />
      <path d="M3 9h18" />
      <path d="M8.5 9 12 21M15.5 9 12 21" />
      <path d="M8.5 9 12 3l3.5 6" />
    </svg>
  );
}

/* Brand signature: the four-point sparkle from the wordmark's "O". */
export function Sparkle(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M12 1.5c.7 6 3.9 9.6 10.5 10.5C15.9 12.9 12.7 16.4 12 22.5c-.7-6.1-3.9-9.6-10.5-10.5C8.1 11.1 11.3 7.5 12 1.5Z" />
    </svg>
  );
}

/* Simplified palm/agave burst from the monogram mark. */
export function PalmMark(props: IconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 21V9" />
      <path d="M12 9C10.2 6.8 7.6 5.6 4.5 5.4M12 9c1.8-2.2 4.4-3.4 7.5-3.6" />
      <path d="M12 9C11 6.4 9 4.6 6.2 3.6M12 9c1-2.6 3-4.4 5.8-5.4" />
      <path d="M12 9c-.2-2.6.6-5 2.2-7M12 9c-.2-2.6-1-5-2.2-7" />
    </svg>
  );
}
