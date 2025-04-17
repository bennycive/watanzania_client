'use client'
import VideoPlayerModal from '@/components/commonComponents/videoplayer/VideoPlayerModal';
import { currentLangCode, placeholderImage, truncateText } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';

const StyleSixCard = ({ item, breakingNewsSect, newsSect }) => {

    const currLangCode = currentLangCode();

    return (
        <Link href={{ pathname: `/${currLangCode}/news/${item.slug}`, query: { language_id: item.language_id } }}
            title='detail-page'>
            <div className="group relative overflow-hidden border borderColor commonRadius h-auto after:content-[''] after:absolute after:bottom-0 after:h-[300px] after:w-full after:textLinearBgStyleSix after:blur-[12px] after:transition-all after:duration-700 hover:after:h-full">
                {
                    !breakingNewsSect &&
                    <span className='categoryTag absolute top-4 left-4 text-[14px] lg:text-[16px] z-[1]'> {truncateText(item?.category_name, 25)}</span>
                }
                <Image src={item?.image} alt={item?.title} loading='lazy' height={0} width={0} className='h-[375px] md:h-[470px] w-auto commonRadius transition-all object-cover duration-500 group-hover:scale-[1.2]'
                    onError={placeholderImage} />
                <div className='absolute bottom-0 z-[1] text-white p-3 flex flex-col gap-2 transition-all duration-300 group-hover:bottom-3'>
                    {
                        !breakingNewsSect &&
                        <span className='text-[14px] lg:text-[16px] text-white font-[600]'>{item?.published_date
                            ? new Date(item?.published_date).toLocaleString('en-in', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })
                            : ''}</span>
                    }
                    <h6 className={`text-[24px] lg:text-[32px] font-[700] line-clamp-2 transition-all duration-500 group-hover:underline`}> {truncateText(item?.title, 35)}</h6>
                </div>
            </div>
            {
                !breakingNewsSect && !newsSect && item.content_value &&
                <VideoPlayerModal videoSect={true} keyboard={false} url={item?.content_value} type_url={item.content_type} />
            }
            {
                breakingNewsSect && item.content_value &&
                <VideoPlayerModal videoSect={true} keyboard={false} url={item?.content_value} type_url={item.content_type} />
            }
        </Link >
    );
};

export default StyleSixCard;
