"use server"

import { InputFile } from "node-appwrite/file";
import { createAdminClient } from "../appwrite"
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";


const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  throw error;
};

const createQueries = (currentUser: Models.Document) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];
  //
  return queries;
};

export const uploadFile = async({file , ownerId , accountId , path} : UploadFileProps)=>{
    const {storage , databases} = await createAdminClient();
    try {
    const inputFile = InputFile.fromBuffer(file, file.name); 

    const bucketFile = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        inputFile
    )
    //to get metadata of the file
    const fileDocument = {
        type : getFileType(bucketFile.name).type,
        name : bucketFile.name,
        url : constructFileUrl(bucketFile.$id),
        extension : getFileType(bucketFile.name).extension,
        size : bucketFile.sizeOriginal,
        owner : ownerId,
        accountId,
        users : [],
        bucketFileId : bucketFile.$id, 
    }
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      //if there is an error uploading file we delete the file instantly    
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to upload file");
      }); 

      revalidatePath(path)
      return parseStringify(newFile);

    } catch (error) {
        handleError(error , "Failed to upload file")
    }

}


export const  getFiles = async() => {
  const {databases} = await createAdminClient();
  try {
      const currentUser = await getCurrentUser();
      if(!currentUser) throw new Error("User not found")

      const queries = createQueries(currentUser);

      const files = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        queries
      );  
      return parseStringify(files)

  } catch (error) {
    handleError(error , "Failed to get files")
  }
}

export const renameFile =async ({name , extension , fileId , path} : RenameFileProps)=>{
  const {databases} = await createAdminClient();
  try {
    const newName = `${name}.${extension}`
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name : newName
      }
    )
    revalidatePath(path)
    return parseStringify(updatedFile)
  } catch (error) {
    handleError(error , "Failed to rename file")
  }

}


export const deleteFile = async({bucketFileId ,fileId , path} : DeleteFileProps) =>{
  const {databases , storage} = await createAdminClient();
  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );
    if(deletedFile){
      await storage.deleteFile(
        appwriteConfig.bucketId,
        bucketFileId
      )
    }
    revalidatePath(path)
    return parseStringify(deletedFile)
  } catch (error) {
    handleError(error , "Failed to delete file")
  }
}