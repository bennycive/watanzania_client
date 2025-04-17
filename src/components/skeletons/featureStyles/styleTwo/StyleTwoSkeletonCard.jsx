'use client'
import Skeleton from 'react-loading-skeleton';

const StyleTwoSkeletonCard = ({ middleCard }) => {
    return (
        <div className="group relative overflow-hidden commonRadius h-auto">
            <Skeleton className={`${middleCard ? 'h-[200px] md:h-[300px] lg:h-[620px]' : 'h-[200px] md:h-[300px] lg:h-[300px]'} commonRadius`} width={'100%'} />
            <div className='absolute bottom-0 p-3 flex flex-col gap-2'>
                <Skeleton height={30} width={70} />
                <Skeleton height={30} width={250} />
            </div>
        </div>
    );
};

export default StyleTwoSkeletonCard;
