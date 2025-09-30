import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline' | 'ghost'
}

export default function Button({ variant = 'solid', className = '', ...props }: ButtonProps): React.JSX.Element {
  const variantClass = variant === 'outline' ? 'btn--outline' : variant === 'ghost' ? 'btn--ghost' : ''
  return <button className={`btn ${variantClass} ${className}`.trim()} {...props} />
}


