'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { currentLangCode, placeholderImage, translate, truncateText } from '@/utils/helpers'
import VideoPlayerModal from '@/components/commonComponents/videoplayer/VideoPlayerModal'
import { FaArrowRightLong } from 'react-icons/fa6'
import { IoEye } from 'react-icons/io5'

const StyleFiveCard = ({ element, videoNewsCard, breakingNewsCard }) => {

    const currLangCode = currentLangCode();

    return (
        element && !videoNewsCard ? <Link href={{ pathname: breakingNewsCard ? `/${currLangCode}/breaking-news/${element.slug}` : `/${currLangCode}/news/${element.slug}`, query: { language_id: element.language_id } }} title='detail-page'>
            <div className="group bodyBgColor shadow-[0_0_6px_0px_rgba(96,70,201,0.12)] p-4 rounded-[16px] flex flex-col gap-4">
                <div>
                    <Image src={element?.image} alt={element?.title} loading='lazy' height={0} width={0} className="w-full h-56 object-cover -mt-20 relative z-2 rounded-[16px] transition-all duration-300 group-hover:-translate-y-2" onError={placeholderImage} />
                </div>
                <div className="">
                    <span className="categoryTag !py-1">
                        {
                            breakingNewsCard ?
                                translate('breakingnews') :
                                truncateText(element.category_name, 10)
                        }
                    </span>
                </div>
                <div>
                    <h5 className="text-[24px] font-bold textPrimary line-clamp-2 m-0">{truncateText(element.title, 34)}</h5>
                    <div className='textSecondary font-[500] text-lg flex items-center gap-2 mt-1 group/edit'>
                        <span className='group-hover/edit:primaryColor'>{translate('readMoreLbl')}</span>
                        <span className='mt-[2px] group-hover/edit:ml-1.5 group-hover/edit:primaryColor transition-all duration-300'><FaArrowRightLong className='rtl:rotate-180'/></span>
                    </div>
                </div>
            </div>
        </Link> :
            element &&
            <div>
                <div className="group bodyBgColor shadow-[0_0_6px_0px_rgba(96,70,201,0.12)] p-4 rounded-[16px] flex flex-col gap-5">
                    <div className='relative'>
                        <Image src={element?.image} alt={element?.title} loading='lazy' height={0} width={0} className="w-full h-56 object-cover -mt-20 relative z-2 rounded-[16px] transition-all duration-300 group-hover:-translate-y-2" onError={placeholderImage} />
                        <VideoPlayerModal videoSect={videoNewsCard} keyboard={false} url={element?.content_value} type_url={element?.content_type} styleFive={true} />
                    </div>
                    <div className="">
                        <span className="categoryTag !py-1">
                            {truncateText(element.category_name, 10)}
                        </span>

                    </div>
                    <div>
                        <div className='flex items-center gap-[10px] font-[500] textSecondary -mt-[4px] mb-1'>
                            <span> <IoEye size={20} /></span>
                            <span>{element?.total_views} {translate('views')}</span>
                        </div>
                        <h5 className="text-[24px] font-bold textPrimary line-clamp-2">{truncateText(element.title, 34)}</h5>
                    </div>
                </div>
            </div>
    )
}

export default StyleFiveCard