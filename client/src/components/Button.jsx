import React from 'react';

const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

const sizeClass = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick, ...rest }) {
  const classes = [variantClass[variant] || variantClass.primary, sizeClass[size] || sizeClass.md, className, disabled ? 'btn-disabled' : ''].filter(Boolean).join(' ');
  return (
    <button className={classes} disabled={disabled} onClick={disabled ? undefined : onClick} {...rest}>
      {children}
    </button>
  );
}
