"use client"

import React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from '@/components/ui/sidebar'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Sun } from 'lucide-react'
import { Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

function AppSidebar() {
  const {theme, setTheme} = useTheme()
  return (
    <Sidebar>
      <SidebarHeader>
        <div className='p-3'>
        <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
        <Image src="/logo.svg" alt="Logo" width={10} height={10}
        className='w-8 h-8' />
        <h2 className='font-bold text-2xl'>AI Bus</h2>
        </div>
        <div>
          {theme === "light" ? (
          <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
            <Sun />
          </Button>) : (
          <Button variant="ghost" size="icon" onClick={() => setTheme("light")}>
            <Moon />
          </Button>
          )}
        </div>
        </div>
        <Button variant="outline" size="lg" className='w-full mt-8'>+ New Chat</Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className='p-3'>
          <h2 className='font-bold text-lg'>Chat</h2>
          <p className='text-sm text-gray-500'>Sign in to start chatting with multiple AI models</p>
          </div>
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter >
        <div className='p-3 mb-5'>
          <Button className={"w-full"} size="lg">
            Signup/Signin</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar