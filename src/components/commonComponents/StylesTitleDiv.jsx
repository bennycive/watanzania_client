import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { translate } from '@/utils/helpers'
import { FaArrowRightLong } from 'react-icons/fa6'

const StylesTitleDiv = ({ title, desc, link, styleSix }) => {

    const currentLanguage = useSelector(currentLanguageSelector)

    return (
        <div className='flex items-center justify-between flex-wrap mb-4 sm:mb-6 gap-3 sm:gap-0'>
            <div className='flex flex-col gap-2'>
                <h1 className='textPrimary text-[20px] md:text-[24px] font-[700]'>{title}</h1>
                <h2 className='textSecondary font-[500]'>{desc}</h2>
            </div>

            {
                !styleSix &&
                <div>
                    <Link href={{ pathname: link, query: { language_id: currentLanguage?.id } }} title={translate('viewMore')}>
                        <button className='flex items-center gap-2 border borderColor bg-transparent hover:hoverBg transition-all duration-300 hover:text-white rounded-[6px] textPrimary font-[700] py-[6px] px-[12px] md:py-[10px] md:px-[25px]'>{translate('viewMore')} <FaArrowRightLong className='mt-[2px] rtl:rotate-180'/></button>
                    </Link>
                </div>
            }
        </div>
    )
}

export default StylesTitleDiv