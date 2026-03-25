"use client"
import React, { use } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import App from 'next/app'
import AppSidebar from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { db } from '@/config/FirebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useEffect } from 'react'

function Provider({children,
  ...props}) {

    const {user} = useUser();
    useEffect(() => {
      if (user) {
        createNewUser();
      }
    }, [user])

    const createNewUser = async () => {
      const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);

      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        console.log("User already exists in Firestore");
        return;
      } 
      else {
        const newUser = {
          email: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName,
          createdAt: new Date(),
          plan: "free",
          remainingMessages: 5,
          credits: 10000,
        };
        await setDoc(userRef, newUser);
        console.log("New user created in Firestore");
      }
    }



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