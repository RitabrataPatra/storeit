import { cn, formatDateTime } from '@/lib/utils'
import React from 'react'

const FormattedDateTime = ({date , className} : {
    date: string | null | undefined, 
    className?: string}) => {
  return (
    <div>
        <p className={cn("body-1 text-light-200" , className)}>{formatDateTime(date)}</p>
    </div>
  )
}

export default FormattedDateTime