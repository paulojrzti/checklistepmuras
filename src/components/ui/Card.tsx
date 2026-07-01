import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverable?: boolean;
  selected?: boolean;
};

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, selected = false, ...props }) => {
  const hoverClass = hoverable ? "transition-transform hover:-translate-y-1 hover:shadow-lg cursor-pointer hover:border-brand-dark-green/50" : "";
  const selectedClass = selected ? "ring-2 ring-brand-dark-green bg-green-50 border-brand-dark-green" : "bg-white border-gray-200";
  
  return (
    <div 
      className={`rounded-xl border shadow-sm ${selectedClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
