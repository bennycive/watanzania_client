import { formatDate, placeholderImage, truncateText } from '@/utils/helpers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FiCalendar } from 'react-icons/fi'

const FeedCard = ({ data, index }) => {
    return (
        <Link href={{ pathname: data?.link }} title='detail-page' target='_blank'>
            <div className={`w-full rounded-lg h-max bg-white dark:secondaryBg p-3 commonRadius grid grid-cols-12 gap-3`} key={index}>
                {
                    data?.image &&
                    <div className='col-span-3'>
                        <Image src={data?.image} width={0} height={0} className='w-full h-auto commonRadius' alt={data?.title} loading='lazy' onError={placeholderImage} />
                    </div>
                }
                <div className='flex flex-col gap-2 col-span-9'>
                    <h1 className='textPrimary font-[700] text-base md:text-lg line-clamp-2'>{data?.title}</h1>
                    {
                        data?.description &&
                        <h2 className='textPrimary font-[500] line-clamp-3'>{truncateText(data?.description, 120)}</h2>
                    }
                    <div className="flex items-center textSecondary">
                        <FiCalendar className="mr-2 mt-1" size={18} />
                        <span className='textSecondary text-[18px] font-[500]'>
                            {formatDate(data?.pubDate)}
                        </span>
                    </div>

                </div>
            </div>
        </Link>
    )
}

export default FeedCard