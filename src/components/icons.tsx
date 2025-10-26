import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const SaveIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 32 32"
    fill="currentColor"
  >
    <g id="_133_save-02" data-name="133 save-02">
      <path d="M26,29H6a3,3,0,0,1-3-3V6A3,3,0,0,1,6,3H20.26a3,3,0,0,1,1.95.72L28,8.64A3,3,0,0,1,29,10.92V26A3,3,0,0,1,26,29ZM6,5A1,1,0,0,0,5,6V26a1,1,0,0,0,1,1H26a1,1,0,0,0,1-1V10.92a1,1,0,0,0-.35-.76L20.91,5.24A1,1,0,0,0,20.26,5Z"/>
      <path d="M18,10H10A2,2,0,0,1,8,8V4A1,1,0,0,1,9,3H19a1,1,0,0,1,1,1V8A2,2,0,0,1,18,10ZM10,5V8h8V5Z"/>
      <path d="M23,29H9a1,1,0,0,1-1-1V17a2,2,0,0,1,2-2H22a2,2,0,0,1,2,2V28A1,1,0,0,1,23,29ZM10,27H22V17H10Z"/>
    </g>
  </svg>
);

export const ExpandSidebarIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
    <rect height="16" rx="2" width="16" x="4" y="4"/>
    <path d="M15 4v16"/>
    <path d="M10 10l-2 2l2 2"/>
  </svg>
);

export const CollapseSidebarIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
    <rect height="16" rx="2" width="16" x="4" y="4"/>
    <path d="M15 4v16"/>
    <path d="M9 10l2 2l-2 2"/>
  </svg>
);
