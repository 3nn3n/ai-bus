import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PricingTable } from '@clerk/nextjs'

function PricingModel({ children }) {
  return (
    <Dialog>
      <DialogTrigger className='w-full'>
        <div className='w-full'>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className={"min-w-5xl"}>
        <DialogHeader>
          <DialogTitle className={"text-bold text-3xl text-center p-5"}>
            <h2>Upgrade To Pro</h2>
          </DialogTitle>
          <DialogDescription>
            <PricingTable />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default PricingModel