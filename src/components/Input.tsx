import React from 'react';

import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, icon, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-3 w-full group/input">
                {label && (
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text-muted group-focus-within/input:text-brand-accent transition-colors ml-1">
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    {icon && (
                        <div className="absolute left-4 text-brand-text-muted group-focus-within/input:text-brand-accent transition-colors pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        className={twMerge(
                            "w-full py-4 bg-brand-surface/40 backdrop-blur-xl border border-brand-border rounded-2xl",
                            "text-brand-text-primary placeholder:text-brand-text-muted font-medium",
                            "focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent/50",
                            "transition-all duration-300 shadow-inner",
                            icon ? "pl-12 pr-5" : "px-5",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
            </div>
        );
    }
);
