import React from 'react'
import Skeleton from 'react-loading-skeleton'

const CommentsSkeleton = ({repliedCard}) => {
  return (
    <div className={`comment flex items-center gap-4 md:gap-6 flex-wrap sm:flex-nowrap ${repliedCard ? 'w-[85%]' : 'w-full'}`}>
                        <div>
                            <Skeleton  height={70} width={70} />
                        </div>
                        <div className="flex flex-col gap-2 md:gap-4 border borderColor commonRadius p-2 textPrimary w-full">
                            <div>
                                <Skeleton width={120} height={20} />
                            </div>
                            <div>
                                <Skeleton count={2} />
                            </div>
                            <div className="flex items-center justify-between relative">
                                <div className="flex items-center gap-6">
                                    <>
                                        <Skeleton  height={30} width={30} />
                                        <Skeleton  height={30} width={30} />
                                    </>
                                </div>
                                <div>
                                    <Skeleton width={80} height={30} />
                                </div>
                            </div>
                        </div>
                    </div> 
  )
}

export default CommentsSkeleton