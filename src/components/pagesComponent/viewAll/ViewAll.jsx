'use client'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import NewsCardTwo from '@/components/commonComponents/commonCards/NewsCardTwo'
import LoadMoreBtn from '@/components/commonComponents/loadermoreBtn/LoadmoreBtn'
import Layout from '@/components/layout/Layout'
import CommonCardSkeleton from '@/components/skeletons/CommonCardSkeleton'
import { currentLanguageSelector } from '@/components/store/reducers/languageReducer'
import { settingsSelector } from '@/components/store/reducers/settingsReducer'
import { getFeatureDataApi } from '@/utils/api/api'
import { NoDataFound, translate } from '@/utils/helpers'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const ViewAll = () => {

    const settingsData = useSelector(settingsSelector)
    const storedLatitude = settingsData?.lat;
    const storedLongitude = settingsData?.long;

    const currentLanguage = useSelector(currentLanguageSelector)
    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [viewAllData, setViewAllData] = useState([])
    const [isBreakingNews, setIsBreakingNews] = useState(false)
    const [isVideoNews, setIsVideoNews] = useState(false)
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')

    const [currentPage, setCurrentPage] = useState(0)
    const dataPerPage = 6 // number of posts per page


    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }
    const router = useRouter()
    const slug = router?.query?.slug

    const fetchNews = async (page) => {

        if (settingsData?.data?.lat || currentPage || slug) {
            !loadMore ? setIsLoading({ loading: true }) : setIsLoading({ loadMoreLoading: true })
            try {
                const { data } = await getFeatureDataApi.getFeatureData({
                    offset: offset * dataPerPage,
                    limit: dataPerPage,
                    language_id: currentLanguage?.id,
                    slug: slug,
                    latitude: storedLatitude,
                    longitude: storedLongitude
                })

                if (!data?.error) {
                    data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setTotalData(data?.data[0]?.news ? data?.data[0]?.news_total : data?.data[0]?.breaking_news ? data?.data[0]?.breaking_news_total : data?.data[0]?.videos_total)

                    if (loadMore) {
                        if (data?.data[0]?.news) {
                            setViewAllData((prevData) => [...prevData, ...data?.data[0]?.news])
                        }
                        else if (data?.data[0]?.videos) {
                            setIsVideoNews(true)
                            setViewAllData((prevData) => [...prevData, ...data?.data[0]?.videos])
                        }
                        else {
                            setIsBreakingNews(true)
                            setViewAllData((prevData) => [...prevData, ...data?.data[0]?.breaking_news])
                        }
                    }
                    else {
                        if (data?.data[0]?.news) {
                            setViewAllData(data?.data[0]?.news);
                        }
                        else if (data?.data[0]?.videos) {
                            setIsVideoNews(true)
                            setViewAllData(data?.data[0]?.videos);
                        }
                        else {
                            setIsBreakingNews(true)
                            setViewAllData(data?.data[0]?.breaking_news);
                        }
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
                console.log(error)
                setViewAllData([])
                setIsLoading({ loading: false })
            }
        }
    };

    useEffect(() => {
        fetchNews()
    }, [currentLanguage?.id, settingsData, slug, offset])

    useEffect(() => {
    }, [totalData, isLoading, viewAllData])

    useEffect(() => {
        setLoadMore(false)
        setOffset(0)
    }, [slug])

    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('viewall')} thirdElement={slug} />

                <section className='viewAllSect container mt-8 md:mt-12'>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
                        {
                            isLoading?.loading ?
                                [...Array(3)].map((_, index) => (
                                    <div key={index}>
                                        <CommonCardSkeleton />
                                    </div>
                                ))
                                :
                                viewAllData && viewAllData?.map((item) => {
                                    return <NewsCardTwo element={item} breakingNews={isBreakingNews} videoNews={isVideoNews} />
                                })
                        }
                    </div>
                    {totalData > dataPerPage && totalData !== viewAllData?.length &&
                        <div className='mt-12'>
                            <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading?.loadMoreLoading} />
                        </div>
                    }
                    {
                        viewAllData?.length < 1 && !isLoading.loading && <NoDataFound />
                    }
                </section>
            </>
        </Layout>
    )
}

export default ViewAll