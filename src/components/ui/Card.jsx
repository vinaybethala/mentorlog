import React from 'react';
import clsx from 'clsx';
import './ui.css';

export const Card = ({ children, className }) => {
  return <div className={clsx('ui-card', className)}>{children}</div>;
};

export const CardHeader = ({ title, subtitle, action, className }) => (
  <div className={clsx('ui-card-header', className)}>
    <div>
      <h3 className="ui-card-title">{title}</h3>
      {subtitle && <p className="ui-card-subtitle">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent = ({ children, className }) => (
  <div className={clsx('ui-card-content', className)}>{children}</div>
);
