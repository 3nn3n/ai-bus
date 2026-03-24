"use client"
import React from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import App from 'next/app'
import AppSidebar from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'

function Provider({children,
  ...props}) {
  return (
    <NextThemesProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
           {...props}>
             <SidebarProvider>
              <AppSidebar />
             <div className='w-full h-screen flex flex-col overflow-hidden'>
              <AppHeader />
              <div className='flex-1 overflow-auto'>
              {children}
              </div>
              </div>
             </SidebarProvider>
      </NextThemesProvider>
  )
}

export default Provider