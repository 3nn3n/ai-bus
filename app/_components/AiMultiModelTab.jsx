import React from 'react'
import { useState } from 'react'
import AiModelList from "../../shared/AiModelList"
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { Loader, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import { useContext } from 'react'
import { AiSelectedModelContext } from '@/context/AiSelectedModel'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/FirebaseConfig'
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


function AiMultiModelTab() {
  const { user } = useUser();
  const [aiModelList, setAiModelList] = useState(AiModelList);
  const { aiSelectedModel, setAiSelectedModel, messages, setMessages } = useContext(AiSelectedModelContext);

  const { has } = useAuth();

  const paidUser = has({ plan: "unlimited_plan" });


  // Add this useEffect to sync UI with context loaded from Firebase
  useEffect(() => {
    setAiModelList((prevList) =>
      prevList.map((item) => ({
        ...item,
        enable: aiSelectedModel[item.model]?.enable ?? item.enable,
      }))
    );
  }, [aiSelectedModel]);

  const onSelectValueChange = async (parentModel, value) => {
    const updatedModel = {
      ...aiSelectedModel,
      [parentModel]: {
        modelId: value,
      }
    };
    setAiSelectedModel(updatedModel);

    // update firebase database with the new selected model for the user
    const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    await updateDoc(docRef, {
      selectedModelPref: updatedModel
    })
  }



  const toggleModelEnable = async (model, value) => {
    setAiModelList((prevList) =>
      prevList.map((item) =>
        item.model === model ? { ...item, enable: value } : item
      )
    );

    const updatedModel = {
      ...aiSelectedModel,
      [model]: {
        ...(aiSelectedModel?.[model] ?? {}),
        enable: value,
      }
    };
    setAiSelectedModel(updatedModel);

    if(!user?.primaryEmailAddress?.emailAddress) return;

    const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    await updateDoc(docRef, { selectedModelPref: updatedModel });
  };

  console.log("Selected Models:", aiSelectedModel);

  return (
    <div className='flex flex-1 h-[70vh] border-b'>
      {aiModelList.map((model, index) => (
        <div key={index} className={`flex flex-col h-full border-r
          ${model.enable ? 'flex-1 min-w-[300px]' : 'w-[100px] flex-none'}`}>

          <div className='flex w-full h-[70px] shrink-0 items-center justify-between border-b p-4'>
            <div className='flex items-center gap-4'>
              <Image src={model.icon} alt={model.model} width={20} height={20} />
              {model.enable && (
                <Select value={aiSelectedModel[model.model]?.modelId} onValueChange={(value) => onSelectValueChange(model.model, value)} disabled={!paidUser && model.premium}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="px-3">
                      <SelectLabel className={"text-sm text-gray-400"}>Free</SelectLabel>
                      {model.subModel.map((subModel, subIndex) => subModel.premium == false && (
                        <SelectItem key={subIndex} value={subModel.id}>{subModel.name}</SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup className="px-3">
                      <SelectLabel className={"text-sm text-gray-400"}>Premium</SelectLabel>
                      {model.subModel.map((subModel, subIndex) => subModel.premium == true && (
                        <SelectItem key={subIndex} value={subModel.id} disabled={!paidUser && subModel.premium}>{subModel.name}{!paidUser && subModel.premium && <Lock className='h-2 w-2 ml-2' />}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>)}
            </div>
            <div>
              {model.enable ? <Switch checked={model.enable}
                onCheckedChange={(v) => toggleModelEnable(model.model, v)}
              /> : <MessageSquare onClick={() => toggleModelEnable(model.model, true)}

              />}
            </div>
          </div>
          {!paidUser && model.premium && model.enable && <div className='flex flex-1 items-center justify-center'>
            <Button> <Lock />Upgrade to Unlock</Button>
          </div>}
          {model.enable && <div className='flex-1 p-4 overflow-auto'>
            <div className='p-4 flex flex-col flex-1 space-y-2'>
              {messages[model.model]?.map((m, i) => (
                <div key={i} className={`p-2 rounded-md ${m.role === "user" ? "bg-orange-100 text-orange-500" : "bg-gray-200 text-gray-500"}`}>
                  {m.role === "assistant" && <span className='text-sm text-gray-400'>{model.model}</span>}
                  <div className='flex items-center gap-3'> {m.content == "Thinking..." && <><Loader className='animate-spin' /><span>Thinking...</span></>}</div>
                  {m?.content !== "Thinking..." && 
                  m?.content && <Markdown remarkPlugins={[remarkGfm]}>{m.content}</Markdown>}
                </div>
              ))}
            </div>
          </div>}
        </div>
      ))}

    </div>
  )
}

export default AiMultiModelTab