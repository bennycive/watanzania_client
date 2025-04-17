'use client'
import Skeleton from 'react-loading-skeleton'

const AdSpaceSkeleton = () => {
  return (
    <div className='container'>
         <Skeleton className='rounded-[4px] mb-6 md:mb-12 cursor-pointer h-[120px] w-full' />
    </div>
  )
}

export default AdSpaceSkeleton
