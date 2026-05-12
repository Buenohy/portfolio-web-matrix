import React from 'react';
import Icon from './Icon';
import Text from './Text';
import { tv, type VariantProps, cx } from 'tailwind-variants';
import { ImSpinner2 } from "react-icons/im";


export const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center cursor-pointer',
    'rounded-xl border-2 font-bold uppercase transition-all duration-400 ease-in-out',
    'backdrop-blur-xs shrink-0 gap-2 whitespace-nowrap outline-none',
    'hover:translate-y-1 focus-visible:translate-y-1 active:translate-y-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary: [
        'bg-transparent text-black-matrix border-black-matrix shadow-black-matrix',
        'dark:text-white-matrix dark:border-white-matrix dark:shadow-white-matrix',
        'shadow-[0_8px_0_0] hover:shadow-[0_4px_0_0]',
        'active:border-green-matrix active:shadow-green-neon active:text-green-neon',
      ],
      secondary: [
        'bg-transparent text-black-matrix border-gray-port shadow-gray-port',
        'dark:border-gray-teste dark:shadow-gray-teste dark:text-white-matrix',
        'shadow-[0_8px_0_0] hover:shadow-[0_4px_0_0]',
        'hover:bg-dark-black hover:text-white-matrix',
        'dark:hover:bg-white-matrix dark:hover:text-dark-black',
        'active:border-green-neon active:shadow-green-neon',
      ],
      redPill: [
        'bg-red-pill text-white-construct border-white-matrix shadow-white-matrix',
        'shadow-[0_8px_0_0] hover:shadow-[0_4px_0_0]',
      ],
      bluePill: [
        'bg-blue-pill text-white-construct border-white-matrix shadow-white-matrix',
        'shadow-[0_8px_0_0] hover:shadow-[0_4px_0_0]',
      ],
      ghost: 'border-transparent shadow-shadow-digital hover:bg-green-neon/10 text-green-terminal hover:translate-y-0',
    },
    size: {
      sm: 'h-9 px-4 py-1 text-xs',
      md: 'h-12 px-6 py-3 text-sm',
      lg: 'h-14 px-8 py-4 text-base',
    },
    disabled: {
      true: 'opacity-50 pointer-events-none',
    },
    handling: {
      true: 'cursor-wait animate-pulse',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    handling: false,
  },
});

export const buttonTextVariants = tv({
  base: 'font-bold uppercase tracking-widest',
  variants: {
    variant: {
      primary: 'text-white-construct',
      secondary: 'text-white-construct',
      redPill: 'text-white-construct',
      bluePill: 'text-white-construct',
      ghost: 'text-green-terminal',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
});

export const buttonIconVariants = tv({
  variants: {
    variant: {
      primary: 'fill-current',
      secondary: 'fill-current',
      redPill: 'fill-white-construct',
      bluePill: 'fill-white-construct',
      ghost: 'fill-green-terminal',
    },
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
  },
});

interface ButtonProps
  extends 
    Omit<React.ComponentProps<'button'>, 'size' | 'disabled'>,
    VariantProps<typeof buttonVariants> {
  icon?: React.ComponentProps<typeof Icon>['svg'];
  handling?: boolean;
}

export default function Button({
  variant,
  size,
  className,
  children,
  disabled,
  handling,
  icon,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants({
        variant,
        size,
        disabled,
        handling,
        className: cx(className, icon && 'pr-3'),
      })}
      disabled={disabled as boolean}
      {...props}
    >
      <Text className={buttonTextVariants({ variant, size })}>
        {children}
      </Text>

      {(icon || handling) && (
        <Icon
          svg={handling ? ImSpinner2 : icon!}
          animate={handling}
          className={buttonIconVariants({ variant, size })}
        />
      )}
    </button>
  );
}