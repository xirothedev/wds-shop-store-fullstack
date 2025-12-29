import type React from 'react';
import { forwardRef } from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'icon'
  | 'size'
  | 'tab';

type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonState = 'default' | 'active' | 'disabled';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  children: React.ReactNode;
};

const variantStyles: Record<ButtonVariant, Record<ButtonState, string>> = {
  primary: {
    default:
      'rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 px-6 py-4 text-sm font-bold tracking-[0.18em] text-black uppercase shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(251,191,36,0.6)]',
    active:
      'rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 px-6 py-4 text-sm font-bold tracking-[0.18em] text-black uppercase shadow-[0_0_30px_rgba(251,191,36,0.4)]',
    disabled:
      'cursor-not-allowed rounded-2xl bg-gray-500/50 px-6 py-4 text-sm font-bold tracking-[0.18em] text-gray-400 uppercase opacity-50',
  },
  secondary: {
    default:
      'rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition-all hover:bg-white/10',
    active:
      'rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase',
    disabled:
      'cursor-not-allowed rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm font-semibold tracking-[0.18em] text-gray-500 uppercase opacity-50',
  },
  outline: {
    default:
      'rounded-xl border border-white/20 px-8 py-4 font-bold transition-all hover:bg-white/10',
    active: 'rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-bold',
    disabled:
      'cursor-not-allowed rounded-xl border border-white/10 px-8 py-4 font-bold text-gray-500 opacity-50',
  },
  ghost: {
    default:
      'rounded-xl bg-white/10 p-3 transition-all hover:bg-amber-500 hover:text-black',
    active: 'rounded-xl bg-amber-500 p-3 text-black',
    disabled:
      'cursor-not-allowed rounded-xl bg-white/5 p-3 text-gray-500 opacity-50',
  },
  icon: {
    default:
      'h-7 w-7 rounded-full border border-white/15 text-lg leading-none text-gray-200 transition-all hover:border-amber-500 hover:text-amber-400',
    active:
      'h-7 w-7 rounded-full border border-amber-500 bg-amber-500/20 text-amber-400',
    disabled:
      'cursor-not-allowed h-7 w-7 rounded-full border border-white/5 text-gray-500',
  },
  size: {
    default:
      'rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-gray-100 transition-all hover:border-amber-500/60',
    active:
      'rounded-xl border border-amber-500 bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)]',
    disabled:
      'cursor-not-allowed rounded-xl border border-white/5 bg-black/30 px-3 py-2 text-xs font-semibold text-gray-500 line-through',
  },
  tab: {
    default:
      'flex-1 rounded-xl px-4 py-2 font-semibold text-gray-300 transition-all hover:bg-white/5',
    active:
      'flex-1 rounded-xl bg-white px-4 py-2 font-semibold text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]',
    disabled:
      'cursor-not-allowed flex-1 rounded-xl px-4 py-2 font-semibold text-gray-500 opacity-50',
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-6 py-4 text-sm',
  lg: 'px-8 py-4 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      state = 'default',
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const finalState: ButtonState = disabled ? 'disabled' : state;
    const isDisabled = disabled || finalState === 'disabled';

    const baseClasses = variantStyles[variant][finalState];
    const sizeClasses = variant !== 'icon' ? sizeStyles[size] : '';
    const combinedClasses = [baseClasses, sizeClasses, className]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        disabled={isDisabled}
        className={combinedClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
