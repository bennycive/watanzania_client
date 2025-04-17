'use client'
import React, { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import NewsCard from '../commonComponents/commonCards/NewsCard'
import CommonCardSkeleton from '../skeletons/CommonCardSkeleton'
import { getBookmarkNewsApi } from '@/utils/api/api'
import { placeholderImage, translate } from '@/utils/helpers'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { userDataSelector } from '../store/reducers/userReducer'
import Image from 'next/image'
import bookmarkImg from '../../assets/Images/bookmark.png'
import LoadMoreBtn from '../commonComponents/loadermoreBtn/LoadmoreBtn'

const Bookmark = () => {

    const userData = useSelector(userDataSelector)
    const currentLanguage = useSelector(currentLanguageSelector)

    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')

    const [currentPage, setCurrentPage] = useState(0)
    const dataPerPage = 9// number of posts per page


    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }

    const [bookmarkData, setBookmarkData] = useState([])

    // api call
    const getbookmarkApi = async () => {
        !loadMore ? setIsLoading({ loading: true }) : setIsLoading({ loadMoreLoading: true })
        try {
            const { data } = await getBookmarkNewsApi.getBookmark({
                language_id: currentLanguage?.id,
                offset: offset * dataPerPage,
                limit: dataPerPage,
            })
            // console.log('bookmardData : ', data?.data)

            if (!data?.error) {
                if (loadMore) {
                    setBookmarkData((prevData) => [...prevData, ...data?.data])
                }
                else {
                    setBookmarkData(data?.data)
                }
                setTotalData(data?.total)
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
            }
            else {
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
                console.log('error =>', data?.message)
            }

        } catch (error) {
            setBookmarkData([])
            console.log(error)
            setIsLoading({ loading: false })
        }
    }

    const setbookmarkApi = async (news_id) => {
        if (typeof news_id == 'number') {
            try {
                const { data } = await getBookmarkNewsApi.setBookmark({
                    news_id: news_id,
                    status: '0'
                })
                setBookmarkData(bookmarkData?.filter(item => item?.news_id !== news_id))
                setTotalData(totalData - 1)
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        if (currentLanguage?.id) {
            getbookmarkApi()
        }
    }, [userData?.data?.id, currentLanguage?.id, offset])

    useEffect(() => {
    }, [bookmarkData])


    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('bookmark')} />

                <section className='bookmark container mt-8 md:mt-12'>
                    {
                        isLoading?.loading ? <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10'>
                            {[...Array(3)].map((_, index) => (
                                <div key={index}>
                                    <CommonCardSkeleton />
                                </div>
                            ))}
                        </div>
                            : bookmarkData && bookmarkData?.length > 0 ? <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10'>
                                {
                                    bookmarkData?.map((element) => {
                                        return <div key={element?.title}>
                                            <NewsCard bookmarkCard={true} element={element} setbookmarkApi={setbookmarkApi} />
                                        </div>
                                    })
                                }
                            </div> :
                                <div className='flexColumnCenter gap-2'>
                                    <div>
                                        <Image src={bookmarkImg} height={0} width={0} className='h-auto w-[200px] md:w-[250px] dark:brightness-[0] dark:invert-[1]' onError={placeholderImage} alt={element?.title} loading='lazy'/>
                                    </div>
                                    <div>
                                        <h3 className='textPrimary font-[700] text-2xl md:text-3xl lg:text-4xl'>{translate('addbookmark')}</h3>
                                    </div>
                                    <div>
                                        <p className='textSecondary text-[18px] font-[500] mt-4'>{translate('dontforgetbookmark')}</p>
                                    </div>
                                </div>
                    }
                    <div className='mt-12'>

                        {totalData > dataPerPage && totalData !== bookmarkData?.length ? (
                            <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                        ) : null}
                    </div>
                </section>
            </>
        </Layout>
    )
}

export default Bookmark