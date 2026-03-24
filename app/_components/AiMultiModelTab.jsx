import React from 'react'
import { useState } from 'react'
import AiModelList from "../../shared/AiModelList"
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

function AiMultiModelTab() {
  const [aiModelList, setAiModelList] = useState(AiModelList);
  const toggleModelEnable = (model, value) => {
    setAiModelList((prevList) =>
      prevList.map((item) =>
        item.model === model ? { ...item, enable: value } : item
      )
    );
  }

  return (
    <div className='flex flex-1 h-[70vh] border-b'>
      {aiModelList.map((model, index) => (
        <div key={index} className={`flex flex-col h-full border-r
          ${model.enable ? 'flex-1 min-w-[300px]' : 'w-[100px] flex-none'}`}>
        
        <div className='flex w-full h-[70px] shrink-0 items-center justify-between border-b p-4'>
          <div className='flex items-center gap-4'>
            <Image src={model.icon} alt={model.model} width={20} height={20} />
           {model.enable && (
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={model.subModel[0].name} />
              </SelectTrigger>
              <SelectContent>
                {model.subModel.map((subModel, subIndex) => (
                  <SelectItem key={subIndex} value={subModel.name}>{subModel.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>)}
          </div>
          <div>
            {model.enable ?<Switch checked={model.enable}
              onCheckedChange={(v) => toggleModelEnable(model.model, v)}
            /> : <MessageSquare onClick={() => toggleModelEnable(model.model, true)}
              
            />}
            </div>
        </div>
       {model.premium && model.enable  && <div className='flex flex-1 items-center justify-center'>
        <Button> <Lock/>Upgrade to Unlock</Button>
      </div>}
        </div>
      ))}
      

    </div>
  )
}

export default AiMultiModelTab