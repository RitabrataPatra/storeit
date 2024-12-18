"use client"
import React, { useEffect, useState } from 'react'

import { AlertCircle } from "lucide-react"
 
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert"
const AlertComp = () => {
    const [alert , setAlert] = useState(true)
    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(false);
          }, 5000); // Hide alert after 5 seconds
      
          return () => clearTimeout(timer); // Cleanup timer on unmount
    },[])
  return (
    <>
    {alert && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            In vercel, you can only upload files less than 4.5mb. This is a vercel limit!
          </AlertTitle>
        </Alert>
      )}
     </>       
  )
}

export default AlertComp