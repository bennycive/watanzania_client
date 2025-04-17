'use client'
import React, { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import CommonCardSkeleton from '../skeletons/CommonCardSkeleton'
import NewsCardTwo from '../commonComponents/commonCards/NewsCardTwo'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { getBreaingNewsApi } from '@/utils/api/api'
import { NoDataFound, translate } from '@/utils/helpers'
import LoadMoreBtn from '../commonComponents/loadermoreBtn/LoadmoreBtn'

const AllBreakingNews = () => {

    const currentLanguage = useSelector(currentLanguageSelector)

    const dataPerPage = 6;

    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [breakingNewsData, setBreakingNewsData] = useState([])
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')

    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }


    // api call 
    const getBreakingNews = async () => {
        !loadMore ? setIsLoading({ loading: true }) : setIsLoading({ loadMoreLoading: true })
        try {
            const { data } = await getBreaingNewsApi.getBreakingNews({
                language_id: currentLanguage?.id,
                offset: offset * dataPerPage,
                limit: dataPerPage,
            })

            if (!data?.error) {
                setTotalData(data?.total)
                if (loadMore) {
                    setBreakingNewsData((prevData) => [...prevData, ...data?.data])
                }
                else {
                    setBreakingNewsData(data?.data);
                }
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
            }
            else {
                console.log('error =>', data?.message)
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
                setBreakingNewsData([])
            }

            return data.data
        } catch (error) {
            console.log(error)
            setBreakingNewsData([])
            setIsLoading({ loading: false })
        }
    }

    useEffect(() => {
        if (currentLanguage?.id) {
            getBreakingNews()
        }
    }, [currentLanguage?.id, offset])

    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('breakingNewsLbl')} />

                <section className='allBreakingNews container mt-8 sm:mt-12'>
                    {
                        isLoading?.loading ? <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10'>
                            {[...Array(3)].map((_, index) => (
                                <div key={index}>
                                    <CommonCardSkeleton />
                                </div>
                            ))}
                        </div>
                            : breakingNewsData && breakingNewsData?.length > 0 ? <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10'>
                                {breakingNewsData?.map((element) => {
                                    return <NewsCardTwo element={element} breakingNews={true} />
                                })}
                            </div> :
                                !isLoading.loading &&
                                <NoDataFound />

                    }
                    <div className='mt-12'>
                        {totalData > dataPerPage && totalData !== breakingNewsData.length ? (
                            <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                        ) : null}
                    </div>

                </section>
            </>
        </Layout>
    )
}

export default AllBreakingNews