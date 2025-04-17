'use client'
import React, { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { IoLogoRss } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { categoriesSelector, categoryLimit, totalCates } from '../store/reducers/CategoriesReducer';
import { currentLangCode, NoDataFound, setCateOffset, translate, truncateText } from '@/utils/helpers';
import { useRouter } from 'next/router';
import { currentLanguageSelector } from '../store/reducers/languageReducer';
import { settingsSelector } from '../store/reducers/settingsReducer';
import { getRssFeedsApi } from '@/utils/api/api';
import Skeleton from 'react-loading-skeleton';
import { setSelectedFeed } from '../store/reducers/RssFeedReducer';
import RelatedNewSections from '../relatedNews/RelatedNewSections';

const RssFeeds = () => {

    const currLangCode = currentLangCode();
    const router = useRouter();
    const dispatch = useDispatch()
    const currentLanguage = useSelector(currentLanguageSelector)

    const categories = useSelector(categoriesSelector);
    const cateLimit = useSelector(categoryLimit);
    const totalCategories = useSelector(totalCates);

    const settings = useSelector(settingsSelector)

    const dataPerPage = 20;

    const [data, setData] = useState([])

    const [isLoading, setIsLoading] = useState({
        loading: true,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')

    const [isFilter, setIsFilter] = useState(false)
    const [isSubCateFilter, setIsSubCateFilter] = useState(false)

    const [selectedCate, setSelectedCate] = useState('')
    const [selectedSubCate, setSelectedSubCate] = useState('')

    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }

    // api call 
    const getRssFeeds = async (cateSlug, subCateSlug) => {
        !loadMore ? setIsLoading({ loading: true }) : setIsLoading({ loadMoreLoading: true })
        try {
            const { data } = await getRssFeedsApi.getRssFeeds({ language_id: currentLanguage.id, limit: dataPerPage, offset: offset * dataPerPage, category_slug: cateSlug, subcategory_slug: subCateSlug })

            if (!data?.error) {
                if (loadMore) {
                    setData((prevData) => [...prevData, ...data.data]);
                }
                else {
                    setData(data?.data)
                }
                setTotalData(data.total)
                setIsFilter(false)
                setIsSubCateFilter(false)
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
            }
            else {
                setData([])
                setIsLoading({ loading: false })
                console.log('error =>', data?.message)
            }
        } catch (error) {
            console.log(error)
            setData([])
            setIsLoading({ loading: false })
        }
    }

    useEffect(() => {
        if (currentLanguage?.id) {
            getRssFeeds()
        }
    }, [currentLanguage, offset])

    const handleSubSelect = (cateSlug, subCateSlug, cateName, subCateName) => {
        getRssFeeds(cateSlug, subCateSlug)
        setSelectedCate(cateName)
        setSelectedSubCate(subCateName)
        // console.log("cateSlug", cateSlug)
        // console.log("subCateSlug", subCateSlug ? subCateSlug : '')
    };

    useEffect(() => {
    }, [selectedCate])

    const handleFeedSelection = (item) => {
        dispatch(setSelectedFeed({ data: item }))
        const trimmedName = item.feed_name.replace(/ +/g, "")
        router.push(`/${currLangCode}/rss-feed/${item.id}`)
    }

    const selectedCateSubCate = selectedCate && categories.find(cate => cate.category_name === selectedCate)

    return (
        <Layout>
            <div className='container commonMT'>
                <div className='flex items-center gap-2'>
                    {
                        settings?.data?.category_mode === '1' &&
                        <div className='flex items-center gap-2'>
                            <h1 className='textPrimary font-[600] text-lg md:text-xl'>{translate('FilterBy')} : </h1>
                            <div className='relative w-[200px]'>
                                <div className={`flex items-center justify-between gap-[1px] textPrimary p-[6px] text-lg commonRadius border borderColor font-[600] cursor-pointer`} onClick={() => setIsFilter(true)}>
                                    <h2>{selectedCate ? selectedCate : translate('selCatLbl')}</h2>
                                    <span>{isFilter ? <FaAngleUp size={16} className='mt-[2px]' /> : <FaAngleDown size={16} className='mt-[2px]' />}</span>
                                </div>
                                {
                                    isFilter &&
                                    <ul className='otherCats commonBg flex flex-col gap-3 absolute w-full mt-[2px] p-2 border borderColor commonRadius z-10' onMouseLeave={() => setIsFilter(false)}>
                                        {
                                            selectedCate &&
                                            <li className='textPrimary font-[600] cursor-pointer' onClick={() => handleSubSelect("", "", "", "")}>{translate('allLbl')}</li>
                                        }
                                        {categories &&
                                            categories?.map((element, index) => (
                                                <li key={index} className='textPrimary font-[600] cursor-pointer' onClick={() => handleSubSelect(element?.slug, '', element?.category_name, '')}
                                                >
                                                    {' '}
                                                    {element.category_name}{' '}

                                                </li>
                                            ))}
                                        {
                                            totalCategories > cateLimit && totalCategories !== categories?.length &&
                                            <span onClick={() => setCateOffset(1)} className='primaryColor font-[600] text-center cursor-pointer'>{translate('loadMore')}</span>
                                        }
                                    </ul>
                                }
                            </div>
                        </div>
                    }
                    {
                        selectedCate && settings?.data?.subcategory_mode === '1' && selectedCateSubCate?.sub_categories.length > 0 &&
                        <div className='flex items-center gap-2'>
                            <div className='relative w-[200px]'>
                                <div className={`flex items-center gap-[1px] textPrimary p-[6px] text-lg commonRadius border borderColor font-[600] cursor-pointer`} onClick={() => setIsSubCateFilter(true)}>
                                    <h2>{selectedSubCate ? selectedSubCate : translate('selSubCatLbl')}</h2>
                                    <span>{isSubCateFilter ? <FaAngleUp size={16} className='mt-[2px]' /> : <FaAngleDown size={16} className='mt-[2px]' />}</span>
                                </div>
                                {
                                    isSubCateFilter &&
                                    <ul className='otherCats commonBg flex flex-col gap-3 absolute w-full mt-[2px] p-2 border borderColor commonRadius z-10' onMouseLeave={() => setIsSubCateFilter(false)}>
                                        {selectedCateSubCate &&
                                            selectedCateSubCate?.sub_categories?.map((element, index) => (
                                                <li key={index} className='textPrimary font-[600] cursor-pointer' onClick={() => handleSubSelect(selectedCateSubCate?.slug, element?.slug, selectedCateSubCate?.category_name, element?.subcategory_name)}
                                                >
                                                    {' '}
                                                    {element?.subcategory_name}{' '}

                                                </li>
                                            ))}
                                    </ul>
                                }
                            </div>
                        </div>
                    }
                </div>


                <div className='grid grid-cols-12 mt-12 gap-6'>
                    <div className='col-span-12 lg:col-span-8'>
                        {
                            isLoading.loading ?
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
                                    {[...Array(4)].map((_, index) => (
                                        <div className='flex items-center gap-3 border borderColor py-[10px] px-[20px] commonRadius' key={index}>
                                            <Skeleton height={30} width={30} />
                                            <Skeleton height={20} width={115} />
                                        </div>
                                    ))}
                                </div>
                                :
                                data && data?.length > 0 ?
                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3 cursor-pointer">
                                        {data && data?.map((item) => {
                                            return <div className='flex items-center gap-3 border borderColor py-[10px] px-[20px] commonRadius' onClick={() => handleFeedSelection(item)} target='_blank' key={item?.feed_name}>
                                                <h3 className='bg-[#EDA918] text-white p-[4px] w-[30px] h-[30px] flexCenter commonRadius text-[24px]'><IoLogoRss /></h3>
                                                <h4 className='textPrimary font-[600] text-lg break-all'>{truncateText(item?.feed_name, 25)}</h4>
                                            </div>

                                        })}
                                    </div>
                                    :
                                    <div>
                                        {NoDataFound()}
                                    </div>

                        }
                    </div>
                    <div className='col-span-12 lg:col-span-4 detailPage'>
                        <RelatedNewSections rssFeedPage={true} />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default RssFeeds