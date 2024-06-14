'use client'

import clsx from "clsx";

interface ButtonProps {
  type?: 'submit' | 'reset' | 'button' | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  danger,
  disabled,
  fullWidth,
  onClick,
  secondary,
  type
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(`
          flex
          justify-center
          items-center
          gap-2
          rounded-md
          py-2
          px-3
          text-sm
          font-semibold
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
        `,
        disabled && 'opacity-50 cursor-default',
        fullWidth && 'w-full',
        secondary ? 'text-gray-800' : 'text-white',
        danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
        !secondary && !danger && 'bg-purple-500 hover:bg-purple-600 focus-visible:outline-purple-600'
      )}
    >
      {children}
    </button>
  )
}

export default Button