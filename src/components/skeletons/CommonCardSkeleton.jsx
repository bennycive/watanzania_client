import React from 'react'
import Skeleton from 'react-loading-skeleton'

const CommonCardSkeleton = ({ subDropCard }) => {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton height={subDropCard ? 150 : 200} />
      <Skeleton height={subDropCard ? 20 : 30} />
      <Skeleton height={subDropCard ? 20 : 30} />
    </div>
  )
}

export default CommonCardSkeleton