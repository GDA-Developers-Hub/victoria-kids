import React from 'react';
import { cn } from '../../utils/utils';

/**
 * Button component with various styles and variants
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Button variant (default, outline, ghost)
 * @param {string} [props.size='default'] - Button size (sm, default, lg, icon)
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {boolean} [props.asChild=false] - Whether to render as a child component
 * @param {React.ReactNode} [props.leftIcon] - Icon to display on the left
 * @param {React.ReactNode} [props.rightIcon] - Icon to display on the right
 */
const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}, ref) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  // Variant styles
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  
  // Size styles
  const sizeStyles = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md text-sm',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10',
  };
  
  // If asChild is true, render children with cloned props
  if (asChild) {
    return React.Children.map(children, child =>
      React.cloneElement(child, {
        className: cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        ),
        ref,
        ...props
      })
    )[0] || null;
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
