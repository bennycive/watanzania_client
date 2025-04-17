'use client'
import Skeleton from 'react-loading-skeleton'

const StyleTitleSkeleton = () => {
    return (
        <div className='flex items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0'>
            <div className='flex flex-col gap-2'>
                <Skeleton height={20} count={2} width={70} />
            </div>
            <Skeleton height={30} width={100} />
        </div>
    )
}

export default StyleTitleSkeleton