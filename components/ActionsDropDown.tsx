"use client";
import { Models } from "node-appwrite";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { deleteFile, renameFile, updateFileUsers } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "./ActionsModalContent";

const ActionsDropDown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropDownOpen(false);
    setAction(null);
    setName(file.name);
    //setEmails([]);
  };

  const handleAction = async () => {
    if(!action) return;
    setIsLoading(true);
    let success = false;
    const actionsObject = {
      rename: () =>
        renameFile({
          fileId: file.$id,
          name,
          extension: file.extension,
          path: path,
        }),

      share: () => updateFileUsers({ fileId: file.$id, emails, path: path }),

      delete: () =>
        deleteFile({
          bucketFileId: file.bucketFileId,
          fileId: file.$id,
          path: path,
        }),
    };
    success = await actionsObject[action.value as keyof typeof actionsObject]();

    if(success) closeAllModals();
    setIsLoading(false);
    // router.refresh();

  };

  const handleRemoveUsers = async(email : string) =>{
    //remove users todo
    const updatedEmails = emails.filter((e)=>e !== email);
    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path: path
    })
    if(success) setEmails(updatedEmails);
    closeAllModals();
  }

  const renderDialogContent = () => {
    if (!action) return null;
    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog-button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
           {/* if you click on rename */}
          {value === "rename" && (
            <DialogDescription className="text-center text-light-100">
              <Input
                value={name}
                type="text"
                placeholder={file.name}
                onChange={(e) => setName(e.target.value)}
              />
            </DialogDescription>
          )}
          {/* if you click on share */}
          {
            value === "share" &&(
             <>
             <ShareInput file={file} onInputChange={setEmails} onRemove={handleRemoveUsers} />
             </>
            )} 
          
          {/* if you click on details */}
          {value === "details" && <FileDetails file={file} />}
           {/* if you click on delete */}
         
        </DialogHeader>
        {["rename", "share", "delete"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button
              variant="destructive"
              onClick={closeAllModals}
              className="modal-cancel-button border"
            >
              Cancel
            </Button>
            {/* //Submit (delete , rename , share)button */}
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <span>
                  <LoaderCircle className="animate-spin" />
                </span>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  




  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            width={32}
            height={32}
            alt="dots"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionitem) => (
            <DropdownMenuItem
              key={actionitem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionitem);

                if (
                  ["rename", "share", "delete", "details"].includes(
                    actionitem.value
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionitem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionitem.icon}
                    width={24}
                    height={24}
                    alt={actionitem.label}
                  />
                  {actionitem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionitem.icon}
                    width={24}
                    height={24}
                    alt={actionitem.label}
                  />
                  {actionitem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionsDropDown;
