'use client'
import React from 'react'
import Skeleton from 'react-loading-skeleton'

const ManagesNewsSkeleton = () => {
    return (
        <div className="manageNewsCard flex flex-col gap-4 bodyBgColor py-[16px] rounded-[16px] overflow-hidden">
            {/* Upper Division */}
            <div className="upperDiv flex items-center justify-between w-full px-[12px] sm:px-[16px] flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton circle={true} height={80} width={80} />
                    <div>
                        <>
                            <Skeleton width={150} height={20} />
                            <Skeleton width={100} height={15} />
                        </>
                    </div>
                </div>
                <div>
                    <Skeleton width={80} height={30} />
                </div>
            </div>

            <hr className="divider" />

            {/* Middle Division */}
            <div className="middleDiv flex flex-col gap-2 sm:gap-3 px-[12px] sm:px-[16px]">
                <>
                    <Skeleton width={200} height={20} />
                    <Skeleton width={150} height={15} />
                    <Skeleton width={180} height={15} />
                </>
            </div>
            <hr className="divider" />

            {/* Lower Division */}
            <div className="lowerDiv flex items-center justify-end gap-4 px-[12px] sm:px-[16px]">
                <>
                    <Skeleton width={100} height={40} />
                    <Skeleton width={100} height={40} />
                </>
            </div>
        </div>
    )
}

export default ManagesNewsSkeleton