import { Models } from 'node-appwrite'
import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {PanelBottomClose } from 'lucide-react'
import { Dialog } from './ui/dialog'
  

// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//   } from "@/components/ui/dialog"
  
const ActionsDropDown = ({file} : {file : Models.Document}) => {
  return (
    <Dialog>
        <DropdownMenu>
  <DropdownMenuTrigger>
    <PanelBottomClose/>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>{file.owner.fullName}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

    </Dialog>

  )
}

export default ActionsDropDown