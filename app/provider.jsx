"use client"
import React, { use, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import App from 'next/app'
import AppSidebar from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { useUser } from '@clerk/nextjs'
import { db } from '@/config/FirebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { AiSelectedModelContext } from '@/context/AiSelectedModel'
import { DefaultModel } from '@/shared/AiModelDefaultList'
import { User } from 'lucide-react'
import { UserDetailContext } from '@/context/UserDetailContext'

function Provider({children,
  ...props}) {

    const {user} = useUser();
    const [aiSelectedModel, setAiSelectedModel] = useState(DefaultModel);
    const [userDetail, setUserDetail] = useState();
    const[messages, setMessages] = useState({});
    const [chatHistoryTrigger, setChatHistoryTrigger] = useState(0);

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
        const userData = userSnap.data();
        setAiSelectedModel(userData?.selectedModelPref??DefaultModel);
        setUserDetail(userData);
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
        setAiSelectedModel(DefaultModel);
        setUserDetail(newUser);
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
            <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
            <AiSelectedModelContext.Provider value={{aiSelectedModel, setAiSelectedModel, messages, setMessages, chatHistoryTrigger, setChatHistoryTrigger}}>
             <SidebarProvider>
              <AppSidebar />
             <div className='w-full h-screen flex flex-col overflow-hidden'>
              <AppHeader />
              <div className='flex-1 overflow-auto'>
              {children}
              </div>
              </div>
             </SidebarProvider>
            </AiSelectedModelContext.Provider>
            </UserDetailContext.Provider>
      </NextThemesProvider>
  )
}

export default Provider