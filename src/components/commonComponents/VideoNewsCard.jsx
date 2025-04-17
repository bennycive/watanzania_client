import React from 'react'
import Image from 'next/image'
import { placeholderImage, translate } from '@/utils/helpers'
import VideoPlayerModal from './videoplayer/VideoPlayerModal'
import { CiStreamOn } from "react-icons/ci";

const VideoNewsCard = ({ element, viewAllCard, liveNewsPage }) => {
    return (
        <div className='relative' key={element?.title}>
            <div className='relative'>
                <Image src={element?.image} onError={placeholderImage} height={0} width={0} alt={element?.title} loading='lazy' className='rounded-[10px] w-full h-[280px] object-cover' />
                {
                    liveNewsPage &&
                    <div className='flexCenter bg-[#ee2934] text-white rounded p-0.5 w-max font-semibold gap-1 absolute bottom-3 right-3'>
                        <CiStreamOn size={22} />
                        <span>{translate('live')}</span>
                    </div>
                }
            </div>
            <div className='mt-4'>
                <h2 className='textPrimary text-[20px] sm:text-[24px] font-[600] line-clamp-2'>{element.title}</h2>
            </div>
            <VideoPlayerModal videoSect={true} keyboard={false} url={viewAllCard ? element?.content_value : element?.url} type_url={viewAllCard ? element?.content_type : element?.type} />

        </div>
    )
}

export default VideoNewsCard