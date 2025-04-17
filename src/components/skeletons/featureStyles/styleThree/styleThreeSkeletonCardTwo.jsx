'use client'
import Skeleton from 'react-loading-skeleton';

const StyleThreeSkeletonCardTwo = () => {
    return (
            <div className="relative overflow-hidden commonRadius h-auto">
                <Skeleton className={`h-[200px] lg:h-[340px] w-full object-cover commonRadius`} />
                <div className='absolute bottom-0 text-white p-4 flex flex-col gap-2 z-[1]'>
                    <Skeleton height={30} width={70} />
                    <Skeleton height={30} width={120} />
                </div>
            </div>
    );
};

export default StyleThreeSkeletonCardTwo;
