import React from 'react';

interface TakaIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TakaIcon = ({
  size = 24,
  stroke = 'currentColor',
  strokeWidth = 2,
  fill = 'none',
  className,
  ...props
}: TakaIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16.5 15.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M7 7a2 2 0 1 1 4 0v9a3 3 0 0 0 6 0v-.5" />
      <path d="M8 11h6" />
    </svg>
  );
};

export default TakaIcon;
