'use client'
import React from 'react'
import Skeleton from 'react-loading-skeleton'

const StyleFiveSkeletonOne = () => {
    return (
        <div className="md:col-span-2 skeletonBg text-white p-6 rounded-[16px] relative overflow-hidden h-full flex items-center">
            <Skeleton className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="relative z-10">
                <Skeleton height={30} width={150} />
                <Skeleton height={40} width={100} />
            </div>
        </div>
    )
}

export default StyleFiveSkeletonOne