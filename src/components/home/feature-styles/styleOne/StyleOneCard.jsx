'use client'
import Link from 'next/link';
import { currentLangCode, placeholderImage, stripHtmlTags, translate, truncateText } from '@/utils/helpers'
import VideoPlayerModal from '@/components/commonComponents/videoplayer/VideoPlayerModal';

const StyleOneCard = ({ item, videoSect, breakingNewsSect }) => {

    const currLangCode = currentLangCode();

    return (
        <div className='grid grid-cols-12 items-center justify-center container pt-6' >
            <div className="content col-span-12 xl:col-span-7 flex flex-col gap-4 sm:gap-6 order-1 xl:order-none  bodyBgColor shadow-[0_0_20px_8px_#6c757d2b] justify-center p-4 sm:p-6 md:p-10  xl:p-12 h-full xl:h-[30rem] w-full xl:w-[55rem] rounded-b-[10px] xl:rounded-[10px] relative z-[1]">
                {
                    item?.category_name &&
                    <div>
                        <span className='categoryTag'> {truncateText(item.category_name, 10)}</span>
                    </div>
                }
                <div>
                    <h3 className='text-[24px] md:text-[34px] font-[600] textPrimary'>{truncateText(item?.title, 60)}</h3>
                </div>
                {
                    item?.description &&
                    <div>
                        {
                            stripHtmlTags(item.description).length > 0 &&
                            <p className='text-[18px] textSecondary font-[600]'>{stripHtmlTags(item.description).substring(0, 100) + '...'}</p>
                        }
                    </div>
                }
                {
                    !videoSect && item?.slug && item?.language_id &&
                    <div className='flex items-center gap-4'>
                        <Link href={{ pathname: `${breakingNewsSect ? `/${currLangCode}/breaking-news/${item.slug}` : `/${currLangCode}/news/${item.slug}`}`, query: { language_id: item.language_id } }}
                            title={translate('readmore')}>
                            <button className='commonBtn text-[18px] md:text-[24px]'>{translate('readmore')}</button>
                        </Link>

                        {item?.content_value && !videoSect ? (
                            // <span className='textPrimary cursor-pointer' onClick={() => handleVideoUrl(item.content_value)}><BsPlayCircle size={40} /></span>
                            <VideoPlayerModal
                                keyboard={false}
                                url={item?.content_value}
                                type_url={item.content_type}
                                styleOne={true}
                            />
                        ) : null}

                    </div>
                }

            </div>
            <div className="img col-span-12 xl:col-span-5 relative">
                <img src={item.image} className='h-[18rem] md:h-[26rem] xl:h-[35rem] w-full rounded-t-[10px] xl:rounded-[10px] object-cover' alt={item.title} onError={placeholderImage} />
                {
                    videoSect &&
                    <VideoPlayerModal videoSect={videoSect} keyboard={false} url={item?.content_value} type_url={item.content_type} styleOne={true} />
                }
            </div>
        </div>
    );
};

export default StyleOneCard;
