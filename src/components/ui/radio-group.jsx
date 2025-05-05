import React, { createContext, useContext, useId } from 'react';
import { cn } from '../../utils/utils';

// Create context for the radio group
const RadioGroupContext = createContext({
  value: undefined,
  onValueChange: () => {},
  name: '',
});

/**
 * RadioGroup component for radio button selections
 */
const RadioGroup = React.forwardRef(({ 
  className, 
  value, 
  onValueChange,
  name,
  ...props 
}, ref) => {
  // Create unique ID for the group if none provided
  const generatedName = useId();
  const groupName = name || `radio-group-${generatedName}`;

  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name: groupName }}>
      <div 
        className={cn("flex gap-2", className)} 
        ref={ref}
        role="radiogroup"
        {...props} 
      />
    </RadioGroupContext.Provider>
  );
});

RadioGroup.displayName = "RadioGroup";

/**
 * RadioGroupItem component for individual radio buttons
 */
const RadioGroupItem = React.forwardRef(({ 
  className, 
  id,
  value,
  ...props 
}, ref) => {
  // Access the radio group context
  const { value: groupValue, onValueChange, name } = useContext(RadioGroupContext);
  const generatedId = useId();
  const radioId = id || `radio-${generatedId}`;
  
  // Check if this item is the selected one
  const isChecked = groupValue === value;
  
  return (
    <input
      type="radio"
      id={radioId}
      className={cn(
        "peer sr-only",
        className
      )}
      name={name}
      value={value}
      checked={isChecked}
      onChange={() => onValueChange(value)}
      ref={ref}
      data-state={isChecked ? "checked" : "unchecked"}
      {...props}
    />
  );
});

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
