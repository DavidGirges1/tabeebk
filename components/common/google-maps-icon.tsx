import React from "react";

interface GoogleMapsIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function GoogleMapsIcon({ className = "w-4 h-4", ...props }: GoogleMapsIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#EA4335"
      />
      <circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
    </svg>
  );
}
