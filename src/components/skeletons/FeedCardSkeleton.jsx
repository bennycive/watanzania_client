import React from 'react'
import Skeleton from 'react-loading-skeleton'

const FeedCardSkeleton = ({ index }) => {
    return (
        <div className='flex gap-3' key={index}>
            <Skeleton height={80} width={80} />
            <div className='flex flex-col gap-3 w-full'>
                <Skeleton height={20} width={'100%'} />
                <Skeleton height={30} width={'100%'} />
                <Skeleton height={20} width={80} />
            </div>
        </div>
    )
}

export default FeedCardSkeleton