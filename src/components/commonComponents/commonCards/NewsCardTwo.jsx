import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { currentLangCode, placeholderImage, truncateText } from '@/utils/helpers'
import VideoNewsCard from '../VideoNewsCard'

const NewsCardTwo = ({ element, breakingNews, videoNews }) => {

    const currLangCode = currentLangCode();

    return (
        videoNews ? <div className='relative' key={element?.title}>
            <VideoNewsCard element={element} viewAllCard={true} />
        </div>
            :
            <Link href={{ pathname: `${breakingNews ? `/${currLangCode}/breaking-news/${element?.slug}` : `/${currLangCode}/news/${element?.slug}`}  `, query: { language_id: element?.language_id } }} key={element?.title}>
                <div>
                    <div>
                        <Image src={element?.image} height={0} width={0} alt={element?.title} className='rounded-[10px] w-full h-auto sm:h-[400px] object-cover transition-all duration-500 hover:-translate-y-2' onError={placeholderImage} loading='lazy'/>
                    </div>
                    <div className='mt-4'>
                        <h2 className='textPrimary text-[20px] sm:text-[24px] font-[600] line-clamp-2'>{truncateText(element?.title, 120)}</h2>
                    </div>
                </div>
            </Link>
    )
}

export default NewsCardTwo