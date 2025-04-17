'use client'
import React, { useState, useEffect } from 'react'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import NewsCard from '@/components/commonComponents/commonCards/NewsCard'
import Layout from '@/components/layout/Layout'
import CommonCardSkeleton from '@/components/skeletons/CommonCardSkeleton'
import { useRouter } from 'next/router'
import { getNewsApi } from '@/utils/api/api'
import { useSelector } from 'react-redux'
import { settingsSelector } from '@/components/store/reducers/settingsReducer'
import { currentLanguageSelector } from '@/components/store/reducers/languageReducer'
import LoadMoreBtn from '@/components/commonComponents/loadermoreBtn/LoadmoreBtn'
import { NoDataFound, translate } from '@/utils/helpers'

const CategoryNews = () => {

    const settingsData = useSelector(settingsSelector)
    const storedLatitude = settingsData?.lat;
    const storedLongitude = settingsData?.long;

    const currentLanguage = useSelector(currentLanguageSelector)
    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [categoriesNewsData, setCategoriesNewsData] = useState([])
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')

    const [currentPage, setCurrentPage] = useState(0)
    const dataPerPage = 8 // number of posts per page


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
                const { data } = await getNewsApi.getNews({
                    offset: offset * dataPerPage,
                    limit: dataPerPage,
                    language_id: currentLanguage?.id,
                    category_slug: slug,
                    latitude: storedLatitude,
                    longitude: storedLongitude
                })

                if (!data?.error) {
                    data?.data?.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setTotalData(data.total)
                    setIsLoading({ loading: false })
                    setIsLoading({ loadMoreLoading: false })
                    if (loadMore) {
                        setCategoriesNewsData((prevData) => [...prevData, ...data?.data])
                    }
                    else {
                        setCategoriesNewsData(data?.data);
                    }
                }
                else {
                    console.log('error =>', data?.message)
                    setCategoriesNewsData([]);
                    setIsLoading({ loading: false })
                    setIsLoading({ loadMoreLoading: false })
                }

            } catch (error) {
                console.log(error)
                setCategoriesNewsData([])
                setIsLoading({ loading: false })
            }
        }
    };

    useEffect(() => {
        fetchNews()
    }, [currentLanguage?.id, settingsData, slug, offset])

    useEffect(() => {
    }, [totalData, isLoading, categoriesNewsData])

    useEffect(() => {
        setLoadMore(false)
        setOffset(0)
    }, [slug])

    const CurrentCategoryName = categoriesNewsData && categoriesNewsData && categoriesNewsData[0]?.category?.category_name

    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('catLbl')} thirdElement={CurrentCategoryName} />

                <section className='categoryNews container mt-8 md:mt-12'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10'>
                        {
                            isLoading.loading ? [...Array(4)].map((_, index) => (
                                <div key={index}>
                                    <CommonCardSkeleton />
                                </div>
                            )) :
                                categoriesNewsData?.map((element) => {
                                    return <NewsCard element={element} categorySlug={slug}/>
                                })
                        }
                        <div>
                        </div>
                    </div>

                    {
                        !isLoading.loading && categoriesNewsData?.length < 1 &&
                        <NoDataFound />
                    }

                    {totalData > dataPerPage && totalData !== categoriesNewsData.length ? (
                        <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                    ) : null}

                </section>
            </>
        </Layout>
    )

}

export default CategoryNews