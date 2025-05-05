import React from 'react';
import { cn } from '../../utils/utils';

/**
 * Badge component for displaying status indicators and labels
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Badge variant
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Badge content
 */
const Badge = React.forwardRef(({
  className,
  variant = 'default',
  ...props
}, ref) => {
  // Base styles for all badges
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant-specific styles
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'text-foreground border border-input',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';

export { Badge };
