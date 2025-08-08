import React from 'react'

export default function InfoItem({label, children}) {
  return (
     <div className="space-y-1">
      <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground">{label}</p>
      <div className="text-base text-foreground">{children}</div>
    </div>
  )
}
