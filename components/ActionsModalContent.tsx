import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label">{label}</p>
    <p className="file-details-value">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <DetailRow label="Format :" value={file.extension} />
      <DetailRow label="Type :" value={file.type} />
      <DetailRow label="Size :" value={convertFileSize(file.size)} />
      <DetailRow label="Owner :" value={file.owner.fullName} />
      <DetailRow
        label="Last Modified :"
        value={formatDateTime(file.$updatedAt)}
      />
    </>
  );
};

export const ShareInput = ({ file, onInputChange, onRemove }: Props) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">Share file with Others</p>
        <Input
          type="email"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
          placeholder="Enter email address"
        />
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} users
            </p>
          </div>
            <ul className="pt-2">
                {file.users.map((email : string) => (
                  <li key={email} className="flex items-center justify-between gap-2">
                    <p className="subtitle-2">{email}</p>
                    <Button onClick={() => onRemove(email)}>
                        <Trash2 />
                    </Button>
                  </li>

                ))}
            </ul>
        </div>
      </div>
    </>
  );
};
