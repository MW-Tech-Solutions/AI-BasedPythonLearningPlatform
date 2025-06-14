import type { SVGProps } from 'react';

export function PyRoutesLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="PyRoutes Logo"
      {...props}
    >
      <path d="M10 40L10 10L30 10Q40 10 40 20Q40 30 30 30L20 30" strokeWidth="3" stroke="hsl(var(--primary))" />
      <path d="M50 40L50 10L70 10Q80 10 80 20Q80 30 70 30L60 30" strokeWidth="3" stroke="hsl(var(--primary))" />
      <text x="80" y="35" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="bold" fill="hsl(var(--foreground))">
        PyRoutes
      </text>
    </svg>
  );
}

export function PythonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15.5V15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5V8.5C13.933 8.5 15.5 10.067 15.5 12C15.5 13.933 13.933 15.5 12 15.5Z" fill="hsl(var(--primary))"/>
      <path d="M12 8.5V8.5C10.067 8.5 8.5 6.93301 8.5 5C8.5 3.06699 10.067 1.5 12 1.5V1.5C13.933 1.5 15.5 3.06699 15.5 5C15.5 6.93301 13.933 8.5 12 8.5Z" transform="translate(0 7)" fill="hsl(var(--accent))"/>
    </svg>
  );
}
