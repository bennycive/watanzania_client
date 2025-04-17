'use client'
import Image from 'next/image'
import React from 'react'
import { placeholderImage } from '@/utils/helpers'

const AdSpace = ({ ad_url, ad_img, style_web, }) => {

    const handleOpenAd = () => {
        if (ad_url.length > 0 && ad_url !== undefined && ad_url !== '' && ad_url !== null) {
            window.open(ad_url, '_blank')
        }
    }


    return (
        <div className=''>
            <div target='_blank' onClick={handleOpenAd}>
                {ad_img && (

                    <Image src={ad_img} height={0} width={0} className='rounded-[4px] mb-6 md:mb-10  cursor-pointer h-[60px] lg:h-[120px] w-full' alt={`style ${style_web} feature sponsored ads news image`} onError={placeholderImage} loading='lazy' />
                )}  
            </div>
        </div>
    )
}

export default AdSpace