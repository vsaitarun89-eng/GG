import React from 'react';
import './Button.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  fullWidth = false,
  ...props 
}) {
  const classes = `btn btn-${variant} ${fullWidth ? 'w-full' : ''} ${className}`;
  return (
    <button className={classes.trim()} {...props}>
      {children}
    </button>
  );
}
