'use client'
import React, { useState, useEffect } from 'react'
import RelatedNewsCard from './RelatedNewsCard'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { getNewsApi } from '@/utils/api/api'
import { currentLangCode, translate } from '@/utils/helpers'
import Skeleton from 'react-loading-skeleton'

const RelatedNewSections = ({ newsSlug, categorySlug, rssFeedPage }) => {

    const currLangCode = currentLangCode();

    const [loading, setLoading] = useState(false)

    const settingsData = useSelector(settingsSelector)
    const currentLanguage = useSelector(currentLanguageSelector)

    const [data, setData] = useState([])

    const storedLatitude = settingsData?.lat;
    const storedLongitude = settingsData?.long;

    const getRelatedNews = async () => {
        try {
            setLoading(true)
            const response = await getNewsApi.getNews({
                offset: '0',
                limit: '10',
                category_slug: categorySlug,
                language_id: currentLanguage?.id,
                latitude: storedLatitude,
                longitude: storedLongitude
            });

            const filteredData = response?.data?.data.filter(element => element.slug !== newsSlug)
            filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

            setData(filteredData)

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getRelatedNews()
    }, [newsSlug, categorySlug, storedLatitude, storedLongitude])



    return (
        <section className='relatedNewsSect flex flex-col flex-wrap gap-4 p-3 border borderColor commonRadius overflow-hidden'>
            {
                loading ? <div className='commonRadius'>
                    <Skeleton height={200} count={3} />
                </div> :
                    data && data?.length > 0 &&
                    <>
                        <div className='textPrimary text-center rounded-t-[4px]'>
                            <h4 className='text-[26px] font-bold'>{translate(rssFeedPage ? 'recentNews' : 'related-news')}</h4>
                        </div>
                        <div className='relatedNews flex flex-col gap-4'>
                            {
                                data?.slice(0, 4).map((element) => {
                                    return <RelatedNewsCard element={element} />
                                })
                            }
                        </div>
                        {
                            data && data?.length > 4 && !rssFeedPage &&
                            <div className='m-auto'>
                                <Link href={`/${currLangCode}/view-all/related-news/${categorySlug}`} title={translate('viewall')}>
                                    <button className='commonBtn text-[18px]'>{translate('viewall')}</button>
                                </Link>
                            </div>
                        }
                    </>
            }
        </section>
    )
}

export default RelatedNewSections