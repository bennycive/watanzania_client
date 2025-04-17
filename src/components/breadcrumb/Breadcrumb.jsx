import { currentLangCode, translate } from '@/utils/helpers';
import Link from 'next/link'
import React from 'react'
import { FaHome } from 'react-icons/fa';

const Breadcrumb = ({ secondElement, thirdElement, fourthElement, fifthElement, categorySlug, subCateSlug }) => {

    const currLangCode = currentLangCode();

    const formatElement = (element) => {
        // Check if the element is a number
        if (!isNaN(element)) {
            return element;
        }
        // Otherwise, capitalize the first letter
        return element?.charAt(0).toUpperCase() + element?.slice(1);
    };

    return (
        <div className="breadcrumbWrapper commonBg">

            <div className='container flex items-center py-8 flex-wrap  capitalize textPrimary text-[18px] md:text-[20px] font-[600] gap-2'>
                <Link href={'/'} title={translate('home')}>
                    <h1 className='flex items-center gap-2'>
                        <FaHome size={25} /> {translate('home')}
                    </h1>
                </Link>
                <span> | </span>
                {
                    secondElement &&
                    <span>{formatElement(secondElement)}</span>
                }

                {thirdElement && (
                    <>
                        <span> | </span>
                        {
                            categorySlug ?
                                <Link href={`/${currLangCode}/categories-news/${categorySlug}`}>{formatElement(thirdElement)}</Link>
                                :
                                <span>{formatElement(thirdElement)}</span>
                        }
                    </>
                )}
                {fourthElement && (
                    <>
                        <span> | </span>
                        {
                            subCateSlug ?
                                <Link href={`/${currLangCode}/categories-news/sub-category/${subCateSlug}`}>{formatElement(fourthElement)}</Link>
                                :
                                <span>{formatElement(fourthElement)}</span>
                        }
                    </>
                )}
                {fifthElement && (
                    <>
                        <span> | </span>
                        <span>{formatElement(fifthElement)}</span>
                    </>
                )}
            </div>
        </div>
    )
}

export default Breadcrumb