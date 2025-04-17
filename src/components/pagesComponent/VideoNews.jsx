'use client'
import React, { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import CommonCardSkeleton from '../skeletons/CommonCardSkeleton'
import VideoNewsCard from '../commonComponents/VideoNewsCard'
import { getVideoNewsApi } from '@/utils/api/api'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { NoDataFound, translate } from '@/utils/helpers'
import LoadMoreBtn from '../commonComponents/loadermoreBtn/LoadmoreBtn'

const VideoNews = () => {

    const currentLanguage = useSelector(currentLanguageSelector)
    const dataPerPage = 6;

    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [videoNewsData, setVideoNewsData] = useState([])
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')

    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }
    // api call
    const getLiveNews = async () => {
        !loadMore ? setIsLoading({ loading: true }) : setIsLoading({ loadMoreLoading: true })
        try {
            const { data } = await getVideoNewsApi.getVideoNews({
                language_id: currentLanguage?.id,
                offset: offset * dataPerPage,
                limit: dataPerPage,
            })

            if (!data?.error) {
                setTotalData(data.total)
                if (loadMore) {
                    setVideoNewsData((prevData) => [...prevData, ...data?.data])
                }
                else {
                    setVideoNewsData(data?.data);
                }
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
            }
            else {
                setVideoNewsData([])
                setIsLoading({ loading: false })
                console.log('error =>', data?.message)
            }

        } catch (error) {
            console.log(error)
            setVideoNewsData([])
            setIsLoading({ loading: false })
        }
    }

    useEffect(() => {
        if (currentLanguage?.id) {
            getLiveNews()
        }
    }, [currentLanguage, offset])


    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('videoNews')} />

                <section className='allBreakingNews container mt-8 sm:mt-12'>
                    {
                        isLoading?.loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, index) => (
                                <div key={index}>
                                    <CommonCardSkeleton />
                                </div>
                            ))}
                        </div>
                            :
                            videoNewsData && videoNewsData?.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {videoNewsData.map((element) => {
                                    return <VideoNewsCard element={element} />
                                })}
                            </div> :
                                <div> {NoDataFound()}</div>
                    }
                    <div className='mt-12'>
                        {totalData > dataPerPage && totalData !== videoNewsData.length ? (
                            <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                        ) : null}
                    </div>

                </section>
            </>
        </Layout>
    )
}

export default VideoNews