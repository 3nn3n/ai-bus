"use client"
import { Mic, Paperclip, Send } from 'lucide-react'
import React, { use } from 'react'
import { Button } from '@/components/ui/button'
import AiMultiModelTab from './AiMultiModelTab'
import { useState } from 'react'
import { useContext } from 'react'
import { AiSelectedModelContext } from '@/context/AiSelectedModel'
import axios from 'axios'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'




function ChatInputBox() {
  const [userInput, setUserInput] = useState("");
  const { aiSelectedModel, setAiSelectedModel, messages, setMessages, setChatHistoryTrigger } = useContext(AiSelectedModelContext);
  const [chatId, setChatId] = useState();
  const { user } = useUser();
  const params = useSearchParams();

  useEffect(() => {
    const chatId_ = params.get("chatId");
    if (chatId_) {
      setChatId(chatId_);
      GetMessages(chatId_);

    } else {  
      setMessages([]);
    // Generate a unique chat ID when the component mounts
    setChatId(uuidv4());
    }
  }, [params]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // 1️⃣ Add user message to all enabled models
    setMessages((prev) => {
      const updated = { ...prev };

      Object.keys(aiSelectedModel).forEach((modelKey) => {
        if (aiSelectedModel[modelKey]?.enable === false) return;
        updated[modelKey] = [
          ...(updated[modelKey] ?? []),
          { role: "user", content: userInput },
        ];
      });

      return updated;
    });

    const currentInput = userInput; // capture before reset
    setUserInput("");

    // 2️⃣ Fetch response from each enabled model
    Object.entries(aiSelectedModel).forEach(
      async ([parentModel, modelInfo]) => {
        if (!modelInfo.modelId || aiSelectedModel[parentModel]?.enable === false) return;

        // Add loading placeholder before API call
        setMessages((prev) => ({
          ...prev,
          [parentModel]: [
            ...(prev[parentModel] ?? []),
            {
              role: "assistant",
              content: "Thinking...",
              model: parentModel,
              loading: true,
            },
          ],
        }));

        try {
          const result = await axios.post("/api/ai-multi-model", {
            model: modelInfo.modelId,
            msg: [{ role: "user", content: currentInput }],
            parentModel,
          });

          const { aiResponse, model } = result.data;

          // 3️⃣ Add AI response to that model’s messages
          setMessages((prev) => {
            const updated = [...(prev[parentModel] ?? [])];

            const loadingIndex = updated.findIndex((m) => m.loading);

            if (loadingIndex !== -1) {
              updated[loadingIndex] = {
                role: "assistant",
                content: aiResponse ?? "",
                model: model ?? parentModel,
                loading: false,
              };
            } else {
              // fallback if no loading msg found
              updated.push({
                role: "assistant",
                content: aiResponse ?? "",
                model: model ?? parentModel,
                loading: false,
              });
            }

            return { ...prev, [parentModel]: updated };
          });
        } catch (err) {
          console.error(err);

          setMessages((prev) => ({
            ...prev,
            [parentModel]: [
              ...(prev[parentModel] ?? []),
              {
                role: "assistant",
                content: "⚠️ Error fetching response.",
                model: parentModel,
                loading: false,
              },
            ],
          }));
        }
      }
    );
  };

  useEffect(() => {
    if (chatId && Object.keys(messages).length > 0) {
      SaveMessages();
    }
  }, [messages]);

  const SaveMessages = async () => {
    const docRef = doc(db, "chatHistory", chatId);

    await setDoc(docRef, {
      chatId: chatId,
      userEmail: user?.primaryEmailAddress?.emailAddress ?? "",
      messages: messages,
      lastUpdated: Date.now(),
    })

    setChatHistoryTrigger((prev) => prev + 1);

  }

  const GetMessages = async (chatId) => {
    const docRef = doc(db, "chatHistory", chatId);
    const docSnap = await getDoc(docRef);
    console.log("Fetched chat history:", docSnap.data());
    const data = docSnap.data();
    if (data && data.messages) {
      setMessages(data.messages);
    }
  }





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
            className='border-0 outline-none w-full'
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
          />
          <div className='mt-3 flex items-center justify-between'>
            <Button variant="ghost" size="icon" className=''>
              <Paperclip className='w-5 h-5' />
            </Button>
            <div className='flex items-center gap-3'>
              <Button variant="ghost" size="icon" className=''>
                <Mic className='w-5 h-5' />
              </Button>
              <Button size="icon" className={"bg-orange-600"} onClick={handleSend}>
                <Send className='w-5 h-5' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ChatInputBox