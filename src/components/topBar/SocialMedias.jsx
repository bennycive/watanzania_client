'use client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { useRouter } from 'next/router'
import { IoLogoRss } from 'react-icons/io5'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { currentLangCode, placeholderImage } from '@/utils/helpers'

const SocialMedias = () => {

    const currLangCode = currentLangCode();
    const router = useRouter();
    const currentLanguage = useSelector(currentLanguageSelector);
    const settings = useSelector(settingsSelector);
    const socialMedias = settings?.data?.social_media;

    return (
        socialMedias && socialMedias?.length > 0 &&
        <div className='flexCenter gap-2'>
            {
                router.asPath === '/' &&
                <span className='text-white text-2xl'>|</span>
            }
            {
                socialMedias.map((item) => {
                    return <Link href={item?.link} key={item?.id} title='social-media-link' className='h-[28px] w-[28px] flexCenter commonRadius transition-all duration-300 hover:primaryBg'>
                        <Image src={item?.image} height={18} width={18} alt='socialMediaImg'  onError={placeholderImage} loading='lazy'/>
                    </Link>
                })
            }

            {
                settings && settings?.data?.rss_feed_mode === '1' &&
                <Link href={{ pathname: `/${currLangCode}/rss-feed`, query: { language_id: currentLanguage?.id } }} title='rss-feed' className='h-[28px] w-[28px] flexCenter commonRadius transition-all duration-300 hover:primaryBg'>
                    <IoLogoRss className='rssIcon' color='#fff' />
                </Link>
            }


        </div >
    )
}

export default SocialMedias