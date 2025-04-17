'use client'

import Skeleton from "react-loading-skeleton";

const StyleSixSkeletonCard = () => {
    return (
        <div className="group relative overflow-hidden rounded-[10px] h-auto">
            <Skeleton height={20} width={70} className='categoryTag absolute top-12 left-4 text-[14px] lg:text-[16px] z-[1]' />
            <Skeleton className='h-[375px] md:h-[470px] w-auto commonRadius' />
            <div className='absolute bottom-0 z-[1] text-white p-3 flex flex-col gap-2'>
                <Skeleton height={20} width={60} />
                <Skeleton height={30} width={200} />
            </div>
        </div>
    );
};

export default StyleSixSkeletonCard;
