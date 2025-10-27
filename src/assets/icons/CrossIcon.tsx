import React from 'react';

interface IconProps {
  className?: string;
}

export const CrossIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M18 6L6 18M6 6L18 18'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default CrossIcon;
