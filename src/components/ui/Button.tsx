import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-green disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    primary: "bg-brand-dark-green text-white hover:bg-brand-deep-green",
    secondary: "bg-brand-gold text-brand-deep-green hover:bg-brand-brown hover:text-white",
    outline: "border border-brand-gray/30 text-brand-gray hover:bg-brand-beige hover:text-brand-dark-green",
    danger: "bg-brand-red text-white hover:bg-red-900",
    ghost: "text-brand-gray hover:bg-brand-beige hover:text-brand-dark-green",
  };
  
  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 py-2 px-4 text-sm",
    lg: "h-12 px-8 text-base",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
