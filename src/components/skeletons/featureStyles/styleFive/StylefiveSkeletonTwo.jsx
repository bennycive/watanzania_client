'use client'
import Skeleton from "react-loading-skeleton"

const StyleFiveSkeletonTwo = () => {
    return (
        <div className="group skeletonBg shadow-[0_0_6px_0px_rgba(96,70,201,0.12)] p-4 rounded-[16px] flex flex-col gap-5">
            <div>
                <Skeleton className="w-full h-56 object-cover -mt-20 relative z-2 rounded-[16px] transition-all duration-300 group-hover:-translate-y-2" />
            </div>
            <div className="">
                <Skeleton height={30} width={80} />
            </div>
            <div>
                <Skeleton height={30} width={120}/>
            </div>
        </div>
    )
}

export default StyleFiveSkeletonTwo