'use client'
import React, { useState, useEffect } from 'react'
import { getTagsApi } from '@/utils/api/api';
import Link from 'next/link'
import { useSelector } from 'react-redux';
import { currentLanguageSelector } from '../store/reducers/languageReducer';
import Skeleton from 'react-loading-skeleton';
import { currentLangCode, translate } from '@/utils/helpers';
import LoadMoreBtn from '../commonComponents/loadermoreBtn/LoadmoreBtn';

const TagSection = () => {

    const currLangCode = currentLangCode();

    const currentLanguage = useSelector(currentLanguageSelector)

    const limit = 10;
    const [isLoading, setIsLoading] = useState({
        loading: false,
        loadMoreLoading: false
    })

    const [loadMore, setLoadMore] = useState(false)
    const [tagsData, setTagsData] = useState([])
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')

    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }


    const getTags = async () => {
        !loadMore ? setIsLoading({ loading: true }) : setIsLoading({ loadMoreLoading: true })
        try {
            const { data } = await getTagsApi.getTags({
                offset: offset * limit,
                limit: limit,
                language_id: currentLanguage?.id
            });

            if (!data?.error) {
                setTotalData(data?.total)
                if (loadMore) {
                    setTagsData((prevData) => [...prevData, ...data?.data]);
                }
                else {
                    setTagsData(data?.data)
                }
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
            }
            else {
                setTagsData([])
                console.log('tagsSect error =>', data?.message)
            }

        } catch (error) {
            console.log(error)
            setTagsData([])
        } finally {
            setIsLoading({ loading: false })
        }
    };

    useEffect(() => {
        getTags()
    }, [currentLanguage, offset])

    useEffect(() => {

    }, [totalData, isLoading])

    return (

        isLoading.loading ?
            <section className='tagSect flex flex-col gap-3 border borderColor commonRadius p-2 md:p-3'>
                {
                    <>
                        <div className='textPrimary text-center rounded-t-[4px] pb-3 border-b borderColor'>
                            <h5 className='text-[26px] font-bold'>{translate('tagLbl')}</h5>
                        </div>
                        <div className='tags flex items-center gap-4 flex-wrap p-2 md:p-4'>

                            <div className='flex items-center gap-4 flex-wrap p-2 md:p-4'>
                                {[...Array(10)].map((_, index) => (
                                    <div key={index}>
                                        <Skeleton height={30} width={50} />
                                    </div>
                                ))}
                            </div>
                        </div>


                        {totalData > limit && totalData !== tagsData.length && <div className='flexCenter pb-4'>
                            <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                        </div>
                        }
                    </>
                }
            </section> :
            tagsData?.length > 0 &&
            <section className='tagSect flex flex-col gap-3 border borderColor commonRadius p-2 md:p-3'>
                {
                    <>
                        <div className='textPrimary text-center rounded-t-[4px] pb-3 border-b borderColor'>
                            <h4 className='text-[26px] font-bold'>{translate('tagLbl')}</h4>
                        </div>
                        <div className='tags flex items-center gap-4 flex-wrap p-2 md:p-4'>

                            {
                                tagsData?.map((element) => {
                                    return <Link key={element?.id} href={`/${currLangCode}/tag/${element?.slug}`} title={element?.tag_name} className='dark:text-white dark:border-white dark:hover:border-transparent font-[500] border textPrimary borderColor py-1 px-2 rounded-[8px] transition-all duration-300 hover:border-transparent hover:hoverBg hover:text-white cursor-pointer'>{element?.tag_name}</Link>
                                })
                            }
                        </div>


                        {totalData > limit && totalData !== tagsData.length && <div className='flexCenter pb-4'>
                            <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                        </div>
                        }
                    </>
                }
            </section>
    )
}

export default TagSection