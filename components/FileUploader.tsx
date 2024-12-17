"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import { getFileType } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import { Loader } from "lucide-react";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";

interface Props {
  ownerId: string;
  accountId: string;
  className: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const {toast} = useToast();
  const [files, setfiles] = useState<File[]>([]);
  const onDrop = useCallback(async(acceptedFiles: File[]) => {
    setfiles(acceptedFiles);

    const uploadPromises = acceptedFiles.map
    (async(file)=>{
      if (file.size > MAX_FILE_SIZE) {
        setfiles((prevFiles)=>prevFiles.filter((f)=>f.name !== file.name));

        return toast({
          title : `Your file size : ${Math.round(file.size /1024 / 1024)} MB`,
          description : `${file.name} is too large.
                          Keep the file size under 48MB`,
          variant : "destructive"
        })
      }
      return uploadFile({file , ownerId , accountId , path })
      .then((uploadedFile)=>{
        if(uploadedFile){
          setfiles((prevFiles)=>prevFiles.filter((f)=>f.name !== file.name));
        }
      })
      ;
    });
    
    await Promise.all(uploadPromises)
    //only upload files if userId , accountId or image path changes
  }, [ownerId , accountId , path]);
  const { getRootProps, getInputProps} = useDropzone({ onDrop });

  const handleRemove = (
    fileName : string , 
    e : React.MouseEvent<HTMLImageElement , MouseEvent>)=>{
    e.stopPropagation();
    setfiles((prevFiles)=>prevFiles.filter((file)=>file.name !== fileName))

  }

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          width={24}
          height={24}
          alt="upload"
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading...</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="flex items-center gap-2 justify-center">
                    <p className="text-sm font-bold">{file.name}</p>
                    <span>
                      <Loader className="animate-spin" color="red" size={20} />
                    </span>
                  </div>
                </div>
                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemove( file.name , e)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
