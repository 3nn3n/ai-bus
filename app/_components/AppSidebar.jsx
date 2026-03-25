"use client"

import React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from '@/components/ui/sidebar'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Bolt, Sun, User2, Zap } from 'lucide-react'
import { Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { SignIn, SignInButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import UsageCreditProgress from './UsageCreditProgress'

function AppSidebar() {
  const {theme, setTheme} = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const {user} = useUser()
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
          {mounted && (theme === "light" ? (
          <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
            <Sun />
          </Button>) : (
          <Button variant="ghost" size="icon" onClick={() => setTheme("light")}>
            <Moon />
          </Button>
          ))}
        </div>
        </div>
        {user ?
        <Button variant="outline" size="lg" className='w-full mt-8'>+ New Chat</Button> :
        <SignIn>
        <Button variant="outline" size="lg" className='w-full mt-8'>+ New Chat</Button>
        </SignIn>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className='p-3'>
          <h2 className='font-bold text-lg'>Chat</h2>
          {!user && <p className='text-sm text-gray-500'>Sign in to start chatting with multiple AI models</p>}
          </div>
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter >
        <div className='p-3 mb-10'>
          {!user ? <SignInButton mode="modal">
          <Button className={"w-full"} size="lg">
            Signup/Signin</Button>
          </SignInButton> : 
          <div>
            <UsageCreditProgress />
          <Button className={"w-full mb-3"}>
            <Zap/>
            <h2>Upgrade to Pro</h2>
          </Button>
          <Button variant="ghost" className='flex gap-5'>
            <User2 />
            <h2>Settings</h2>
            </Button>
            </div>
            }

        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar