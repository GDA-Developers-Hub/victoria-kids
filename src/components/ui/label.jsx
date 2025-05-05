import React from 'react';
import { cn } from '../../utils/utils';

/**
 * Label component for form elements
 * 
 * @param {Object} props - Component props
 * @param {string} [props.htmlFor] - ID of the element this label is for
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Label content
 */
const Label = React.forwardRef(({ 
  className, 
  htmlFor,
  ...props 
}, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});

Label.displayName = 'Label';

export { Label };
