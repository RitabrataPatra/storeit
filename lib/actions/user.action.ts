"use server"

import { createAdminClient } from "@/lib/appwrite/index"
import { appwriteConfig } from "../appwrite/config"
import { ID, Query } from "node-appwrite"
import { parseStringify } from "../utils"

const getUserByEmail = async (email : string) =>{
    const {databases} = await createAdminClient()

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])]
    )

    return result.total > 0 ? result.documents[0] : null
}
const handleError = (error : unknown , message : string) => {
    console.error(message , error);
    throw error
}

const sendEmailOTP = async({email }: {email : string} ) => {
    const {account} = await createAdminClient()
    try {
        const session = await account.createEmailToken(ID.unique() , email)

        return session.userId
    } catch (error) {
        handleError(error , "Failed to send email OTP")
    }
}

export const createAccount = async ({fullName , email} : {
    fullName : string,
    email : string
}) =>{
    const existingUser = await getUserByEmail(email)

    const accountId = await sendEmailOTP({email})

    if(!accountId) throw new Error("Failed to send email OTP")

    if(!existingUser){
        const {databases} = await createAdminClient()

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
              fullName,
              email,
              avatar : "https://png.pngtree.com/png-vector/20230903/ourmid/pngtree-man-avatar-isolated-png-image_9935819.png",  
              accountId
            }
        )
    }  
    return parseStringify({accountId}) 
}