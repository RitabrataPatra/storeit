import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import Search from './Search'
import FileUploader from './FileUploader'

const Header = () => {
  return (
    <header className='header'>
      <Search/>

      <div className='header-wrapper'>
        <FileUploader/>

        <form action="">
          <Button type='submit' className='sign-out-button'>
            <Image src="/assets/icons/logout.svg" 
            width={24} 
            height={24} 
            alt="logout"
          />
          </Button>
        </form>
      </div>
    </header>
  )
}

export default Header