import React from 'react'
import Skeleton from 'react-loading-skeleton'

const DetailPageSkeleton = () => {
    return (
        <div className='flex flex-col gap-3 h-full w-full'>
            <Skeleton height={250} width={'100%'} count={3} />
        </div>
    )
}

export default DetailPageSkeleton