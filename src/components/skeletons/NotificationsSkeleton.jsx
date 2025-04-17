import React from 'react'
import Skeleton from 'react-loading-skeleton'

const NotificationsSkeleton = () => {
    return (
        <div className='flex items-center justify-between flex-wrap gap-y-6 p-4 md:p-6 border borderColor commonBg commonRadius'>
            <div className='flex items-center gap-6'>
                <div><Skeleton width={30} height={30}/></div>
                <div className='flex flex-col gap-4'>
                    <Skeleton width={220} height={20}/>
                    <Skeleton width={130} height={20}/>
                </div>
            </div>
            <div>
                <Skeleton width={60} height={30}/>
            </div>
        </div>
    )
}

export default NotificationsSkeleton