import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', children, variant = 'primary', size = 'md', ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white cursor-pointer';

        const variants = {
            primary: 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-[0_4px_14px_0_rgba(24,24,27,0.39)] hover:shadow-[0_6px_20px_rgba(24,24,27,0.23)] active:scale-[0.98]',
            secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 shadow-sm active:scale-[0.98]',
            outline: 'border border-zinc-200 bg-transparent hover:bg-zinc-50 text-zinc-900 active:scale-[0.98]',
            ghost: 'bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:scale-[0.98]',
            danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg active:scale-[0.98]',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-6 text-base',
        };

        const variantStyles = variants[variant] || variants.primary;
        const sizeStyles = sizes[size] || sizes.md;

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`.trim()}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;