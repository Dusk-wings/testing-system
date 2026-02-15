import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

function Card({ children, className, ...props }: Props) {
    return (
        <div {...props}
            className={`p-4 inner-shadow shadow-md dark:shadow-gray-800 dark:bg-zinc-800 bg-white dark:text-white dark:border-gray-700/50 border border-gray-300/50 rounded-lg transition-all duration-300  ${className}`}>
            {children}
        </div>
    )
}

function CardHeader({ children, className, ...props }: Props) {
    return (
        <div {...props} className={`${className}`}>
            {children}
        </div>
    )
}

function CardBody({ children, className, ...props }: Props) {
    return (
        <div {...props} className={`${className}`}>
            {children}
        </div>
    )
}

function CardFooter({ children, className, ...props }: Props) {
    return (
        <div {...props} className={`${className}`}>
            {children}
        </div>
    )
}

export { Card, CardHeader, CardBody, CardFooter }
