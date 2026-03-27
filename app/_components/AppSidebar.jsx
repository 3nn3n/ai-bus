"use client"

import React, { use } from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from '@/components/ui/sidebar'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Bolt, Sun, User2, Zap } from 'lucide-react'
import { Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState, useContext } from 'react'
import { SignIn, SignInButton, useAuth } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import UsageCreditProgress from './UsageCreditProgress'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import moment from 'moment'
import Link from 'next/link'
import { AiSelectedModelContext } from '@/context/AiSelectedModel'
import axios from 'axios'
import PricingModel from './PricingModel'

function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState([]);
  const { chatHistoryTrigger } = useContext(AiSelectedModelContext);
  const [freeRemainingMsg, setFreeRemainingMsg] = useState(0);
  const { aiSelectedModel, setAiSelectedModel, messages, setMessages, setChatHistoryTrigger } = useContext(AiSelectedModelContext);

  const { has } = useAuth();

  const paidUser = has({ plan: "unlimited_plan" });

  useEffect(() => {
    if (user) {
      setChatHistory([]);
      fetchChatHistory();
      GetRemainingTokenMessages();
    }
  }, [user, chatHistoryTrigger])

  useEffect(() => {
    if (user) {
      GetRemainingTokenMessages();
    }
  }, [messages]);


  const fetchChatHistory = async () => {
    const q = query(collection(db, "chatHistory"), where("userEmail", "==", user?.primaryEmailAddress?.emailAddress));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setChatHistory((prev) => [...prev, doc.data()])
    });
  }

  const getLastUserMessage = (chat) => {
    const allMessages = Object.values(chat.messages).flat();
    const userMessages = allMessages.filter(m => m.role === "user");
    const lastUserMessage = userMessages[userMessages.length - 1].content || null;

    const lastUpdated = chat.lastUpdated || Date.now();
    const formattedDate = moment(lastUpdated).fromNow();

    return {
      chatId: chat.chatId,
      message: lastUserMessage,
      lastMsgDate: formattedDate,
    }
  }

  const GetRemainingTokenMessages = async () => {
    const result = await axios.post("/api/user-remaining-msg");
    console.log("Remaining token", result);
    setFreeRemainingMsg(result?.data?.remainingToken);
  }





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
            <Link href={'/'}>
              <Button variant="outline" size="lg" className='w-full mt-8'>+ New Chat</Button>
            </Link> :
              <Button variant="outline" size="lg" className='w-full mt-8'>+ New Chat</Button>
            }
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className='p-3'>
            <h2 className='font-bold text-lg'>Chat</h2>
            {!user && <p className='text-sm text-gray-500'>Sign in to start chatting with multiple AI models</p>}
            {chatHistory.map((chat, index) => (
              <Link href={`?chatId=${chat.chatId}`} key={index} className='mt-2' >
                <div className='p-3 hover:bg-gray-100 cursor-pointer'>
                  <h2 className='text-sm text-gray-400'>{getLastUserMessage(chat).lastMsgDate}</h2>
                  <h2 className='text-lg line-clamp-1'>{getLastUserMessage(chat).message}</h2>
                </div>
                <hr />
              </Link>
            ))}
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
              {!paidUser &&
                <div><UsageCreditProgress remainingToken={freeRemainingMsg} />
                  <PricingModel>
                    <Button className={"w-full mb-3"}>
                      <Zap />
                      <h2>Upgrade to Pro</h2>
                    </Button>
                  </PricingModel></div>}
              <Button variant="ghost" className='flex gap-5 w-full border-orange-400'>
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