import React from 'react'

interface ToggleProps {
  label: string;
  id: string;
  disabled?: boolean;
  checked?: boolean;
  onChecked?: (checked: boolean) => void;
}

function Toggle({ id, label, disabled, checked, onChecked }: ToggleProps) {
  return (
    <div className="w-full flex items-center justify-between">
      <input
        type="checkbox"
        id={id}
        value=""
        className="sr-only peer"
        disabled={disabled}
        onChange={(e) => {
          if (onChecked) onChecked(e.target.checked);
        }}
        checked={checked}
      />
      <div className="flex-1">
        <label htmlFor={id} className="text-sm text-gray-900 cursor-pointer">
          {label}
        </label>
      </div>
      <label htmlFor={id}
        className="
          relative 
          w-11 
          h-6 
          bg-gray-200 
          peer-focus:outline-none 
          peer-focus:ring-4 
          peer-focus:ring-purple-300 
          rounded-full 
          peer 
          peer-checked:after:translate-x-full
          peer-checked:after:border-white 
          after:content-[''] 
          after:absolute 
          after:top-[2px] 
          after:start-[2px] 
          after:bg-white 
          after:border-gray-30
          0 after:border 
          after:rounded-full 
          after:h-5 
          after:w-5 
          after:transition-all 
          peer-checked:bg-purple-600
          cursor-pointer
        "
      />
    </div>
  )
}

export default Toggle