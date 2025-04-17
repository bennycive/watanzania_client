'use client'
import { currentLangCode, placeholderImage, truncateText } from '@/utils/helpers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const RelatedNewsCard = ({ element }) => {

    const currLangCode = currentLangCode();

    return (
        <Link href={{ pathname: `/${currLangCode}/news/${element?.slug}`, query: { language_id: element?.language_id } }} title='detail-page' key={element?.title}>
            <div className='relatedNewsCard grid grid-cols-12 border borderColor p-3 commonRadius gap-3'>
                <div className='col-span-4'>
                    <Image src={element?.image} height={0} width={0} alt={element?.title} loading='lazy' className='w-[130px] h-[100px] sm:h-[130px] object-cover commonRadius' onError={placeholderImage} />
                </div>
                <div className='col-span-8 flex flex-col gap-3'>
                    <span className='categoryTag'>{element?.category?.category_name}</span>
                    <span className='textPrimary font-[600] line-clamp-2 sm:line-clamp-3'>{truncateText(element.title, 100)}</span>
                </div>
            </div>
        </Link>
    )
}

export default RelatedNewsCard