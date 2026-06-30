import React from 'react';
import clsx from 'clsx';
import './ui.css';

export const Button = React.forwardRef(({ children, className, variant = 'primary', size = 'md', isLoading, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={clsx('ui-button', `ui-button-${variant}`, `ui-button-${size}`, className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="ui-spinner"></span> : children}
    </button>
  );
});
Button.displayName = 'Button';
