"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import { getFileType } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import { Loader } from "lucide-react";

interface Props {
  ownerId: string;
  accountId: string;
  className: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const [files, setfiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setfiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default FileUploader;
