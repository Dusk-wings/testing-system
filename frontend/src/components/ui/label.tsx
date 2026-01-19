import React from 'react'

function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label {...props} className={`text-sm font-medium dark:text-zinc-200  ${className}`}>
            {children}
        </label>
    )
}

export default Label
