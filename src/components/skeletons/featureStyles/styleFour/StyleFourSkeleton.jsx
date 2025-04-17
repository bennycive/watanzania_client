'use client'
import StyleTitleSkeleton from '@/components/skeletons/featureStyles/StyleTitleSkeleton';
import Skeleton from 'react-loading-skeleton';

const StyleFourSkeleton = () => {

    return (
        <div className='styleFour'>
            <div className="container">
                <StyleTitleSkeleton />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        [...Array(6)].map((_, index) => (
                            <div className='flex flex-col gap-4 rounded-[10px] commonBg p-4 border border-[lightgray]' key={index}>
                                <div className='relative'>
                                    <Skeleton height={200} width={'100%'} />
                                </div>
                                <div>
                                    <Skeleton height={30} width={'100%'} />
                                </div>
                                <div className='pb-2'>
                                    <Skeleton height={30} width={100} />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

        </div>
    )
}

export default StyleFourSkeleton