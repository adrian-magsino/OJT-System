const variantClasses = {
  default: 'bg-gray-200 text-gray-800',
  success: 'bg-green-100 text-green-800',
  destructive: 'bg-red-100 text-red-800',
  secondary: 'bg-blue-100 text-blue-800',
}

export function Badge({ variant = 'default', className = '', children }) {
  return (
    <span
      className={`inline-block px-2 py-1 text-sm rounded-full font-medium ${variantClasses[variant] || ''} ${className}`}
    >
      {children}
    </span>
  )
}
