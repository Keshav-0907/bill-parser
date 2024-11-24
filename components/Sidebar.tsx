'use client'
import React from 'react'
import { Button } from './ui/button'
import { ArrowRight, Box, DownloadCloud, ReceiptText, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Sidebar = () => {
  const router = useRouter()

  const handleRoute = (route) => {
    router.push(route)
  }
  return (
    <div className='w-56 min-h-screen border-r-2 bg-gray-900 text-white py-2 px-5 flex flex-col gap-10'>
      <div onClick={()=>handleRoute('/')} className='text-3xl font-bold'>
        Swish
      </div>

      <div className='flex gap-2 flex-col'>
        <div className='text-xs text-gray-500'>Actions</div>
        <div>
          <Button  onClick={()=>handleRoute('/')} className='bg-white text-black w-full hover:bg-gray-600 hover:text-white'> Upload <ArrowRight /> </Button>
        </div>
      </div>

      <div className='flex gap-2 flex-col'>
        <div className='text-xs text-gray-500'>Tabs</div>
        <div className='flex flex-col gap-5'>
          <Button onClick={()=>handleRoute('/invoice')} className='bg-white text-black w-full hover:bg-gray-600 hover:text-white'> Invoice <ReceiptText /> </Button>
          <Button onClick={()=>handleRoute('/products')} className='bg-white text-black w-full hover:bg-gray-600 hover:text-white'> Products <Box /> </Button>
          <Button onClick={()=>handleRoute('/customers')} className='bg-white text-black w-full hover:bg-gray-600 hover:text-white'> Customers <User /> </Button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar