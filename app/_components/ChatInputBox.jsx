"use client"
import { Mic, Paperclip, Send } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import AiMultiModelTab from './AiMultiModelTab'

function ChatInputBox() {
  return (
    <div className='relative h-full'>
      {/* Page Content */}
      <div>
        <AiMultiModelTab />

      </div>
      {/* fixed height input box at the bottom of the page */}
      <div className='fixed bottom-0 left-0 justify-center w-full px-4 pb-6 flex'>
        <div className='w-full border rounded-xl shadow-md p-4 max-w-2xl '>
          <input type="text" placeholder="Ask me anything..." 
          className='border-0 outline-none'/>
          <div className='mt-3 flex items-center justify-between'>
            <Button variant="ghost" size="icon" className=''>
              <Paperclip className='w-5 h-5' />
            </Button>
            <div className='flex items-center gap-3'>
              <Button variant="ghost" size="icon" className=''>
                <Mic className='w-5 h-5' />
              </Button>
              <Button size="icon" className={"bg-orange-600"}>
                <Send className='w-5 h-5' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInputBox