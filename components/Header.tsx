import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import Search from './Search'
import FileUploader from './FileUploader'
import { signOutUser } from '@/lib/actions/user.action'

const Header = ({accountId , userId }: {accountId : string , userId : string}) => {
  return (
    <header className='header'>
      <Search/>

      <div className='header-wrapper'>
        <FileUploader accountId={accountId} ownerId={userId} className=''/>

        <form action={async() =>{
          "use server";
          await signOutUser();
        }}>
          <Button type='submit' className='sign-out-button'>
            <Image src="/assets/icons/logout.svg" 
            width={24} 
            height={24} 
            alt="logout"
            className='w-6'
            />
          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header