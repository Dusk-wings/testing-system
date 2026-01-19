import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string
}

function Input({ className, ...props }: Props) {
    return (
        <div>
            <input
                className={`p-2  drop-shadow-md text-sm border border-gray-300/50 rounded-lg ${className}`}
                {...props}
            />
        </div>
    )
}

export default Input