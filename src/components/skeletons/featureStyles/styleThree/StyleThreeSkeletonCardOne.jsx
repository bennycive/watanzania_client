'use client'
import Skeleton from "react-loading-skeleton";

const StyleThreeSkeletonCardOne = () => {
    return (
        <div className="group relative overflow-hidden commonRadius h-auto">
            <Skeleton className={`h-[200px] lg:h-[520px] w-full object-cover commonRadius`} />
            <div className='text-white  mt-6 flex flex-col gap-2'>
                <Skeleton height={30} width={70} />
                <Skeleton height={30} width={200} />
                <Skeleton height={30} width={200} />
            </div>
        </div>
    );
};

export default StyleThreeSkeletonCardOne;
