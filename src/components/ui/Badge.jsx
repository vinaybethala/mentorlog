import React from 'react';
import clsx from 'clsx';
import './ui.css';

export const Badge = ({ children, variant = 'primary', className }) => {
  return (
    <span className={clsx('ui-badge', `ui-badge-${variant}`, className)}>
      {children}
    </span>
  );
};
