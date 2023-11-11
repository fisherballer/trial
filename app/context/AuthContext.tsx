'use client'
//client side rendering
import {SessionProvider} from 'next-auth/react'

export default function Provider(
    {children}: {
    children: React.ReactNode
  }){
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}