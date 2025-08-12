export function Card({ className = '', children }) {
  return (
    <div className={`rounded-lg border bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ className = '', children }) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
}

export function CardContent({ className = '', children }) {
  return <div className={`${className}`}>{children}</div>
}
