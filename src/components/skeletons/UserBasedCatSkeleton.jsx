'use client'
import React from 'react'
import Skeleton from 'react-loading-skeleton'

const UserBasedCatSkeleton = () => {
    return (
        <div className='flex items-center justify-between border borderColor rounded-[10px] p-4 flex-wrap gap-4'>
            <Skeleton width={80} height={80} />
            <Skeleton width={130} height={30} />
            <Skeleton width={60} height={40} />
        </div>
    )
}

export default UserBasedCatSkeleton