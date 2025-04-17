'use client'
import React, { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import { useRouter } from 'next/router'
import CommonCardSkeleton from '../skeletons/CommonCardSkeleton'
import NewsCard from '../commonComponents/commonCards/NewsCard'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { getNewsApi } from '@/utils/api/api'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { NoDataFound, translate } from '@/utils/helpers'
import LoadMoreBtn from '../commonComponents/loadermoreBtn/LoadmoreBtn'

const AllRelatedNews = () => {

    const settingsData = useSelector(settingsSelector)
    const storedLatitude = settingsData?.lat;
    const storedLongitude = settingsData?.long;

    const currentLanguage = useSelector(currentLanguageSelector)
    const router = useRouter()
    const slug = router?.query?.slug;

    const dataPerPage = 9
    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [viewAllData, setViewAllData] = useState([])
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')

    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }

    // api call
    const getRelatedNews = async () => {
        !loadMore ? setIsLoading({ loading: true }) : setIsLoading({ loadMoreLoading: true })
        try {
            const { data } = await getNewsApi.getNews({
                offset: offset * dataPerPage,
                limit: dataPerPage,
                category_slug: slug,
                language_id: currentLanguage?.id,
                latitude: storedLatitude,
                longitude: storedLongitude
            })

            if (!data?.error) {
                setTotalData(data.total)
                // Filter out elements with the same id as props.Cid
                // const filteredData = data.data.filter(element => element.slug !== props.Nid)
                const filteredData = data.data;
                filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
                if (loadMore) {
                    setViewAllData((prevData) => [...prevData, ...filteredData])
                }
                else {
                    setViewAllData(filteredData);
                }
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
            }
            else {
                setViewAllData([])
                setIsLoading({ loading: false })
                console.log('error =>', data?.message)
            }

        } catch (error) {
            setViewAllData([])
            setIsLoading({ loading: false })
        }
    }


    useEffect(() => {
        if (currentLanguage?.id) {
            getRelatedNews()
        }
    }, [slug, location, offset])

    useEffect(() => {

    }, [totalData, isLoading])

    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('related-news')} thirdElement={slug} />

                <section className='categoryNews container mt-8 md:mt-12'>
                    {
                        isLoading.loading ? <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10'>
                            {[...Array(4)].map((_, index) => (
                                <div key={index}>
                                    <CommonCardSkeleton />
                                </div>
                            ))}
                        </div>
                            :
                            viewAllData && viewAllData?.length > 0 ? <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10'>
                                {
                                    viewAllData?.map((element) => {
                                        return <NewsCard element={element} />
                                    })
                                }
                            </div> :
                                <>
                                    {NoDataFound()}
                                </>
                    }
                    <div className='mt-12'>
                        {totalData > dataPerPage && totalData !== viewAllData?.length ? (
                            <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                        ) : null}
                    </div>
                </section>
            </>
        </Layout>
    )
}

export default AllRelatedNews