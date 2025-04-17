'use client'
import VideoPlayerModal from '@/components/commonComponents/videoplayer/VideoPlayerModal';
import { currentLangCode, placeholderImage, translate } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { LuCalendarDays } from 'react-icons/lu';

const StyleThreeCardTwo = ({ Data, breakingNewsCard, videoNewsCard }) => {

    const currLangCode = currentLangCode();

    return (
        Data && !videoNewsCard ? <Link href={{ pathname: breakingNewsCard ? `/${currLangCode}/breaking-news/${Data?.slug}` : `/${currLangCode}/news/${Data?.slug}`, query: { language_id: Data?.language_id } }} title='detail-page'>
            <div className="relative overflow-hidden commonRadius h-auto  after:content-[''] after:absolute after:bottom-0 after:h-[300px] after:w-full after:textLinearBg after:z-[1]">
                <Image src={Data?.image} height={0} width={0} alt={Data?.title} loading='lazy' className={`lg:h-[340px] w-full object-cover commonRadius`} onError={placeholderImage} />
                <div className='absolute top-[20px] left-[20px]'>
                    {
                        breakingNewsCard ?
                            <span className='categoryTag text-[14px] lg:text-[16px]'>{translate('breakingnews')}</span> :
                            <span className='categoryTag text-[14px] lg:text-[16px]'>{Data?.category_name}</span>
                    }
                </div>
                <div className='absolute bottom-0 text-white p-4 pb-2 flex flex-col gap-2 z-[4]'>
                    <span className='flex items-center gap-2 font-[500]'><LuCalendarDays size={20} />{new Date(Data?.date).toLocaleString('en-us', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}</span>
                    <h4 className={`text-[18px] md:text-[24px] lg:text-[38px] font-[700] line-clamp-2`}>{Data?.title}</h4>
                </div>
            </div>
        </Link> :
            Data &&
            <div>
                <div className="relative overflow-hidden commonRadius h-auto  after:content-[''] after:absolute after:bottom-0 after:h-[300px] after:w-full after:textLinearBg after:-z-[1]">
                    <Image src={Data?.image} height={0} width={0} alt={Data?.title} loading='lazy' className={`lg:h-[340px] w-full object-cover commonRadius`} onError={placeholderImage} />
                    <div className='absolute top-[20px] left-[20px]'>
                        <span className='categoryTag text-[14px] lg:text-[16px]'>{translate('breakingnews')}</span>
                    </div>
                    <div className='absolute bottom-0 text-white p-4 pb-2 flex flex-col gap-2 z-[4]'>
                        <span className='flex items-center gap-2 font-[500]'><LuCalendarDays size={20} />{new Date(Data?.date).toLocaleString('en-us', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}</span>
                        <h4 className={`text-[18px] md:text-[24px] lg:text-[38px] font-[700] line-clamp-2`}>{Data?.title}</h4>
                    </div>
                    {videoNewsCard && Data?.content_value &&
                        <VideoPlayerModal videoSect={videoNewsCard} keyboard={false} url={Data?.content_value} type_url={Data?.content_type} />
                    }
                </div>
            </div>
    );
};

export default StyleThreeCardTwo;
