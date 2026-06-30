import React from 'react';
import clsx from 'clsx';
import './ui.css';

export const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className={clsx('ui-input-group', className)}>
      {label && <label className="ui-label">{label}</label>}
      <input ref={ref} className={clsx('ui-input', { 'ui-input-error': error })} {...props} />
      {error && <span className="ui-error-text">{error}</span>}
    </div>
  );
});
Input.displayName = 'Input';

export const Select = React.forwardRef(({ label, error, options, className, ...props }, ref) => {
  return (
    <div className={clsx('ui-input-group', className)}>
      {label && <label className="ui-label">{label}</label>}
      <select ref={ref} className={clsx('ui-select', { 'ui-input-error': error })} {...props}>
        <option value="" disabled>Select an option</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="ui-error-text">{error}</span>}
    </div>
  );
});
Select.displayName = 'Select';
