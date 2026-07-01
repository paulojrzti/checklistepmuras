import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "bg-gray-100 text-brand-gray border border-gray-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-amber-100 text-amber-900 border border-amber-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
  };
  
  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
