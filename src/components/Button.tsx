import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        // Classes for different variants
        const variantClasses = {
            primary: 'bg-brand-accent hover:bg-brand-accent-hover active:scale-[0.98] text-white shadow-xl shadow-brand-accent/20 border border-transparent',
            secondary: 'bg-brand-surface hover:bg-brand-elevated active:scale-[0.98] text-brand-text-primary border border-brand-border backdrop-blur-md',
            outline: 'border-2 border-brand-border hover:border-brand-accent/50 text-brand-text-secondary hover:text-brand-text-primary bg-transparent active:scale-[0.98]',
        };

        const sizeClasses = {
            sm: 'px-4 py-2 text-xs font-black uppercase tracking-widest',
            md: 'px-6 py-3 text-sm font-black uppercase tracking-widest',
            lg: 'px-10 py-4 text-base font-black uppercase tracking-widest',
        };

        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={twMerge(
                    "inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-300",
                    "disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {children}
            </button>
        );
    }
);
