import type { SVGProps } from 'react';

/** Minimal UI icon set (1.5 px stroke, currentColor). Directional icons carry `icon-directional` so they mirror in RTL. */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, className, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ChevronDown = (p: IconProps) => (
  <Svg {...p}><path d="M6 9.5l6 6 6-6" /></Svg>
);
export const ArrowEnd = ({ className, ...p }: IconProps) => (
  <Svg {...p} className={`icon-directional ${className ?? ''}`}><path d="M4 12h15M13.5 6.5L19 12l-5.5 5.5" /></Svg>
);
export const MenuIcon = (p: IconProps) => (
  <Svg {...p}><path d="M3.5 8h17M3.5 16h17" /></Svg>
);
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>
);
export const PauseIcon = (p: IconProps) => (
  <Svg {...p}><path d="M9 6v12M15 6v12" /></Svg>
);
export const PlayIcon = (p: IconProps) => (
  <Svg {...p}><path d="M8 5.5v13l10-6.5z" /></Svg>
);
