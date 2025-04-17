'use client'
import VideoPlayerModal from '@/components/commonComponents/videoplayer/VideoPlayerModal';
import { currentLangCode, placeholderImage, translate } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRightLong } from "react-icons/fa6";
import { IoEye } from 'react-icons/io5';
import { LuCalendarDays } from 'react-icons/lu';

const StyleFourCard = ({ value, breakingNewsSect, videoSect }) => {

    const currLangCode = currentLangCode();
    return (
        videoSect ?
            <div className='flex flex-col gap-3 commonRadius commonBg p-4 relative'>
                <div className='relative after:content-[""] transition-all duration-700 after:transition-all after:duration-700 after:absolute after:top-[50%] hover:after:top-0 after:bottom-[50%] hover:after:bottom-0 after:left-0 after:right-0 after:bg-[#ffffff99] after:opacity-100 after:hover:opacity-0'>
                    <Image src={value?.image} height={0} width={0} alt={value?.title} loading='lazy' className='h-[250px] md:h-[300px] w-full rounded-[8px] object-cover' onError={placeholderImage} />
                </div>
                <div className='flex items-center gap-[20px]'>
                    {
                        !breakingNewsSect &&
                        <div className='flex items-center gap-[10px] font-[500]'>
                            <span> <LuCalendarDays size={20} /></span>
                            <span>{new Date(value?.date).toLocaleString('en-us', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}</span>
                        </div>
                    }
                    <div className='flex items-center gap-[10px] font-[500]'>
                        <span> <IoEye size={20} /></span>
                        <span>{value?.total_views} {translate('views')}</span>
                    </div>
                </div>
                <div>
                    <h5 className='line-clamp-2 sm:h-[68px] textPrimary text-[20px] md:text-[24px] font-[700]'>{value?.title}</h5>
                </div>
                <div className='py-2 pb-0 textSecondary font-[500] text-[18px] flex items-center gap-2 border-t borderColor group'>
                    <span className='group-hover:primaryColor transition-all duration-300'>{translate('readMoreLbl')}</span>
                    <FaArrowRightLong className='group-hover:primaryColor transition-all duration-300 group-hover:ml-2 mt-[2px] rtl:rotate-180' />
                </div>
                {videoSect &&
                    <VideoPlayerModal videoSect={videoSect} keyboard={false} url={value?.content_value} type_url={value?.content_type} />
                }
            </div>
            :
            <Link href={{ pathname: breakingNewsSect ? `/${currLangCode}/breaking-news/${value?.slug}` : `/${currLangCode}/news/${value?.slug}`, query: { language_id: value?.language_id } }}
                title='detail-page'>
                <div className='flex flex-col gap-3 commonRadius commonBg p-4 relative'>
                    <div className='relative after:content-[""] transition-all duration-700 after:transition-all after:duration-700 after:absolute after:top-[50%] hover:after:top-0 after:bottom-[50%] hover:after:bottom-0 after:left-0 after:right-0 after:bg-[#ffffff99] after:opacity-100 after:hover:opacity-0'>
                        <Image src={value?.image} height={0} width={0} alt={value?.title} loading='lazy' className='h-[250px] md:h-[300px] w-full rounded-[8px] object-cover' onError={placeholderImage} />
                    </div>
                    <div className='flex items-center gap-[20px] textSecondary'>
                        {
                            !breakingNewsSect &&
                            <div className='flex items-center gap-[10px] font-[500]'>
                                <span> <LuCalendarDays size={20} /></span>
                                <span>{new Date(value?.date).toLocaleString('en-us', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}</span>
                            </div>
                        }
                        <div className='flex items-center gap-[10px] font-[500]'>
                            <span> <IoEye size={20} /></span>
                            <span>{value?.total_views} {translate('views')}</span>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <h4 className='line-clamp-2 sm:h-[68px] textPrimary text-[20px] md:text-[24px] font-[700]'>{value?.title}</h4>
                    </div>
                    <div className='py-2 pb-0 textSecondary font-[500] text-[18px] flex items-center gap-2 border-t borderColor group'>
                        <span className='group-hover:primaryColor transition-all duration-300'>{translate('readMoreLbl')}</span>
                        <FaArrowRightLong className='group-hover:primaryColor transition-all duration-300 group-hover:ml-2 mt-[2px] rtl:rotate-180' />
                    </div>
                </div>
            </Link>
    );
};

export default StyleFourCard;
