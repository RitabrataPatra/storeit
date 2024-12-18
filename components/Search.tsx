"use client"
import { SearchIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { usePathname, useSearchParams } from 'next/navigation'
import { getFiles } from '@/lib/actions/file.action'
import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce';

const Search = () => {
  const router = useRouter()
  const[query , setQuery] = useState("")
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query") || ""
  const [results, setResults] = useState<Models.Document[]>([])
  const path = usePathname()
  const [open , setOpen] = useState(false)
  const [debouncedQuery] = useDebounce(query, 300)
  
  useEffect(() => {
    const fetchFiles = async () => {
        if (debouncedQuery.length === 0) {
          setResults([]);
          setOpen(false);
          return router.push(path.replace(searchParams.toString(), ""));
        }
        const files = await getFiles({ types:[], searchText : debouncedQuery})
        console.log(files)
        setResults(files.documents)
        setOpen(true)
    }
    fetchFiles()
  },[debouncedQuery])

  useEffect(() => {
    if(!searchQuery){
      setQuery("")
    }
  },[searchQuery])

    const handleClickItem = (file : Models.Document) => {
      setOpen(false)
      setResults([])
      router.push(`/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`)
    }


  return (
    <div className="search">
      <div className="search-input-wrapper">
        <SearchIcon />
        <Input
          value={query}
          placeholder="Search"
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className="search-result shadow-lg">
            {results.length > 0 ? (
              results.map((file) => <li className="flex items-center justify-between gap-4" key={file.$id} onClick={() => handleClickItem(file)}>
                <div className='flex items-center gap-4 cursor-pointer'>
                  <Thumbnail type={file.type} extension={file.extension} url={file.url} className='size-9 min-w-9' />
                  <p className='subtitle-2 line-clamp-1 text-light-100'>{file.name}</p>
                </div>
                
                <FormattedDateTime date={file.$createdAt} className='caption line-clamp-1 text-light-200' />
              </li>)
            ) : (
              <p>No file found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Search