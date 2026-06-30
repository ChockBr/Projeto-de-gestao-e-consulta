type IconName =
  | 'search'
  | 'location'
  | 'pin'
  | 'bed'
  | 'bath'
  | 'suite'
  | 'parking'
  | 'area'
  | 'ruler'
  | 'tag'
  | 'user'
  | 'heart'
  | 'heartBroken'
  | 'settings'
  | 'clipboard'
  | 'checkCircle'
  | 'xCircle'
  | 'fileText'
  | 'close';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

function Icon({ name, size = 16, className = '' }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: `icon-inline ${className}`.trim(),
    'aria-hidden': true,
    focusable: false,
  };

  switch (name) {
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <line x1="20" y1="20" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'location':
      return (
        <svg {...common}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...common}>
          <path d="M12 22s8-5.5 8-12a8 8 0 1 0-16 0c0 6.5 8 12 8 12z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case 'bed':
      return (
        <svg {...common}>
          <path d="M3 20V8" />
          <path d="M3 13h18v7" />
          <path d="M7 13V9h4a2 2 0 0 1 2 2v2" />
          <path d="M13 13V9h5a3 3 0 0 1 3 3v1" />
        </svg>
      );
    case 'bath':
      return (
        <svg {...common}>
          <path d="M4 12h16" />
          <path d="M5 12v4a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-4" />
          <path d="M8 12V7a2 2 0 0 1 4 0" />
        </svg>
      );
    case 'suite':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="10" rx="2" />
          <path d="M7 12h4" />
          <path d="M13 12h4" />
          <path d="M3 17v3" />
          <path d="M21 17v3" />
        </svg>
      );
    case 'parking':
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M10 17V7h4a3 3 0 1 1 0 6h-4" />
        </svg>
      );
    case 'area':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h6v6H9z" />
        </svg>
      );
    case 'ruler':
      return (
        <svg {...common}>
          <path d="M4 20 20 4" />
          <path d="M7 17h2" />
          <path d="M10 14h2" />
          <path d="M13 11h2" />
          <path d="M16 8h2" />
        </svg>
      );
    case 'tag':
      return (
        <svg {...common}>
          <path d="M20.59 13.41 11 23l-9-9V5h9z" />
          <circle cx="7.5" cy="7.5" r="1.5" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20a8 8 0 0 1 16 0" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
        </svg>
      );
    case 'heartBroken':
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
          <path d="m12 8-2 3h3l-2 5" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09c0 .66.39 1.26 1 1.51.58.24 1.24.11 1.69-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06c-.46.46-.58 1.14-.33 1.73.25.61.85 1.01 1.51 1.01H21a2 2 0 1 1 0 4h-.09c-.66 0-1.26.39-1.51 1.01Z" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg {...common}>
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="M16 4h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" />
          <path d="M8 12h8" />
          <path d="M8 16h8" />
        </svg>
      );
    case 'checkCircle':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'xCircle':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      );
    case 'fileText':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h6" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    default:
      return null;
  }
}

export default Icon;
