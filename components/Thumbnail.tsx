import { cn, getFileIcon } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

interface Props {
    className?: string;
    url?: string;
    imageClassName?: string;
    type: string;
    extension: string;
}

const Thumbnail = ({
    className ,
    url = "",
    imageClassName,
    type,
    extension

} : Props) => {
    const isImage = type === "image" && extension !== "svg";
  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image",
        )}
      />
    </figure>
  )
}

export default Thumbnail