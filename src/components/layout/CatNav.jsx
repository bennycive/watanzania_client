'use client'
import React, { useState, useEffect } from 'react'
import { FaAngleDown, FaAngleUp, FaChevronRight } from 'react-icons/fa'
import NewsCard from '../commonComponents/commonCards/NewsCard'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { useRouter } from 'next/router'
import CommonCardSkeleton from '../skeletons/CommonCardSkeleton'
import { getNewsApi } from '@/utils/api/api'
import { currentLangCode, setCateOffset, translate } from '@/utils/helpers'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { themeSelector } from '../store/reducers/CheckThemeReducer'
import { categoriesSelector, categoryLimit, totalCates } from '../store/reducers/CategoriesReducer'

const CatNav = () => {

    const currLangCode = currentLangCode();

    const categories = useSelector(categoriesSelector);
    const cateLimit = useSelector(categoryLimit);
    const totalCategories = useSelector(totalCates);

    const darkThemeMode = useSelector(themeSelector);

    const router = usePathname();

    const navigate = useRouter()

    const currentLanguage = useSelector(currentLanguageSelector)

    const settingsData = useSelector(settingsSelector)

    const storedLatitude = settingsData?.lat;
    const storedLongitude = settingsData?.long;

    const dataPerPage = 4

    const [currentPage, setCurrentPage] = useState(0)

    const [catId, setCatId] = useState('')

    const [subCatSlug, setSubCatSlug] = useState('')

    const [subCatDrop, setSubCatDrop] = useState(false)
    const [currentCategory, setCurrentCategory] = useState([])

    const [subCatData, setSubCatData] = useState([])
    const [loading, setLoading] = useState(false)
    const [subLoading, setSubLoading] = useState(true)

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const currentData = subCatData && subCatData.data && subCatData.data.slice(0, dataPerPage)

    const lengthdata = (subCatData && subCatData.total) || 0


    const handleCategoryChange = (categories) => {
        if (categories.slug) {
            navigate.push(`/${currLangCode}/categories-news/${categories.slug}?language_id=${currentLanguage?.id}`)
            setSubCatDrop(false)
        }
    }

    const handleSubCategoryChange = () => {
        if (subCatSlug) {
            navigate.push(`/${currLangCode}/categories-news/sub-category/${subCatSlug}`)
            setSubCatDrop(false)
        }
    }

    const handleSubCatDropdown = (category) => {
        setCurrentCategory(category)
        setCatId(category.id)
        setSubCatDrop(true)
        setSubCatSlug('')
    }

    const fetchNews = async (page) => {
        try {
            setSubLoading(true)
            const response = await getNewsApi.getNews({
                offset: page * dataPerPage,
                limit: dataPerPage,
                get_user_news: 0,
                search: '',
                language_id: currentLanguage?.id,
                category_id: catId,
                subcategory_slug: subCatSlug,
                tag_id: '',
                slug: '',
                latitude: storedLatitude,
                longitude: storedLongitude,
            });
            const data = response.data;
            setSubCatData(data)

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSubLoading(false)
        }
    };

    useEffect(() => {
        if (currentLanguage) {
            fetchNews(currentPage)
        }

    }, [subCatSlug, currentPage, catId, currentLanguage])


    return (
        categories && categories?.length > 0 && settingsData && settingsData?.data?.category_mode === '1' &&
        <div className={`border-y borderColor py-2 hidden xl:block`}>
            <div className="container">
                <div className="catSubCatWrapper relative flex items-center justify-between">

                    <div className="catContainer pb-1 flex items-center gap-16 overflow-hidden overflow-x-auto w-full mr-2">

                        {
                            categories && categories?.slice(0, 10).map((element) => (
                                <div key={element?.id} className='text-center'
                                >
                                    <div className='catNav'>

                                        {
                                            element?.sub_categories?.length > 0 && settingsData && settingsData?.data?.subcategory_mode === '1' ?
                                                <div
                                                    className={`flex items-center gap-[2px] cursor-pointer w-max textPrimary ${subCatDrop && currentCategory && currentCategory.id === element.id ? 'activeSubDrop' : ''}`}
                                                    onClick={() => handleSubCatDropdown(element)}
                                                >

                                                    <b>{element.category_name} </b>
                                                    <span>{subCatDrop && currentCategory && currentCategory.id === element.id ? <FaAngleUp /> : <FaAngleDown />}</span>
                                                </div> :
                                                <span
                                                    className={`textPrimary cursor-pointer block !w-max ${subCatDrop && currentCategory && currentCategory.id === element.id ? 'activeSubDrop' : ''}`}
                                                    onClick={() => handleCategoryChange(element)}
                                                >

                                                    <b>{element.category_name} </b>
                                                </span>
                                        }
                                    </div>

                                    {
                                        settingsData && settingsData?.data?.subcategory_mode === '1' ?
                                            subCatDrop && currentCategory && currentCategory.id === element.id ? <div className="subCatDrop bg-white absolute left-0 z-[2] top-10 z-12 h-[390px] w-full shadow-[0_6px_8px_#00000026]"
                                                onMouseLeave={() => setSubCatDrop(false)}
                                            >
                                                <div className="grid grid-cols-6">
                                                    <div className='subCatNamesWrapper border-r border-[lightgray] h-[390px] overflow-hidden overflow-y-scroll col-span-1'>
                                                        <div onClick={() => setSubCatSlug('')} className={`flex items-center justify-between p-5 border-b border-[lightgray] font-[600] cursor-pointer ${subCatSlug === '' ? 'primaryColor' : 'textPrimary'}`}>
                                                            <span>
                                                                {translate('allLbl')}
                                                            </span>
                                                            <span>

                                                                {subCatSlug === '' ? <FaChevronRight /> : null}
                                                            </span>
                                                        </div>
                                                        {
                                                            currentCategory?.sub_categories?.map((subCat) => {
                                                                return <div onClick={() => setSubCatSlug(subCat?.slug)} key={subCat?.slug} className={`flex items-center justify-between p-5 border-b border-[lightgray] font-[600] cursor-pointer ${subCatSlug === subCat?.slug ? 'primaryColor' : 'textPrimary'}`}>
                                                                    <span>
                                                                        {subCat.subcategory_name}
                                                                    </span>
                                                                    {subCatSlug === subCat?.slug ? <FaChevronRight /> : null}
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                    <div className="subCatDataWrappper w-full col-span-5 grid grid-cols-4 h-max gap-6 p-4">
                                                        {
                                                            subLoading ? [...Array(4)].map((_, index) => (
                                                                <div key={index}>
                                                                    <CommonCardSkeleton subDropCard={true} />
                                                                </div>
                                                            ))
                                                                :
                                                                currentData && currentData.length > 0 ? (
                                                                    currentData.map(element => (
                                                                        <div key={element?.title}>
                                                                            <NewsCard element={element} subDropCard={true} />
                                                                        </div>
                                                                    ))
                                                                ) : null
                                                        }

                                                        {
                                                            lengthdata > dataPerPage ?
                                                                <div className="grid grid-cols-1 w-full col-span-4 h-full">
                                                                    {
                                                                        subCatSlug === '' ?
                                                                            <div className='flex items-end justify-end'>
                                                                                <button className='viewAll border-[2px] secondaryBorder textPrimary rounded-[6px] p-2 font-[600] transition-all duration-300 hover:hoverBg hover:text-white dark:border-white' onClick={() => handleCategoryChange(element)}>{translate('viewall')}</button>
                                                                            </div>
                                                                            :
                                                                            <div className='flex items-end justify-end'>
                                                                                <button className='viewAll border-[2px] secondaryBorder textPrimary rounded-[6px] p-2 font-[600] transition-all duration-300 hover:hoverBg hover:text-white dark:border-white' onClick={() => handleSubCategoryChange()}>{translate('viewall')}</button>
                                                                            </div>
                                                                    }
                                                                </div> : null
                                                        }
                                                        {
                                                            !currentData &&
                                                            <div className='col-span-12 flexCenter !h-[300px]'>
                                                                <div className={`text-xl textPrimary text-center my-5 font-[600]`}>{translate('nodatafound')}</div>
                                                            </div>
                                                        }
                                                    </div>

                                                </div>

                                            </div>
                                                : null
                                            : null
                                    }
                                </div>


                            ))
                        }

                    </div>
                    {
                        categories && categories?.length > 10 &&
                        <div className='relative'>
                            <button className={` ${darkThemeMode ? 'bg-white text-black' : 'commonBg textPrimary'} commonRadius border !w-[166px] flexCenter font-[700]`} onClick={() => setIsMenuOpen(true)}> {translate('More')} {isMenuOpen ? <FaAngleUp className='mt-[2px] ml-[1px]' /> : <FaAngleDown className='mt-[2px] ml-[1px]' />}</button>
                            {
                                isMenuOpen &&
                                <div className='otherCats flex flex-col gap-3 absolute bg-white !text-black w-full mt-[2px] p-2 border borderColor commonRadius z-10' onMouseLeave={() => setIsMenuOpen(false)}>
                                    {
                                        categories?.slice(10, categories?.length)?.map((element) =>
                                        (
                                            element?.sub_categories?.length > 0 ?
                                                <NavigationMenu key={element?.id}>
                                                    <NavigationMenuList>
                                                        <NavigationMenuItem>
                                                            <NavigationMenuTrigger className='bg-transparent dropdownTrigg p-0 h-max w-max'><span className='text-black font-[600] flex items-center gap-1 cursor-pointer'>
                                                                {element.category_name}
                                                            </span></NavigationMenuTrigger>
                                                            <NavigationMenuContent className='w-full bg-white relative z-[1] text-black'>
                                                                <div className='flex flex-col gap-3 !w-full max-w-full py-2 px-4'>
                                                                    {element.sub_categories.map((data, index) => (
                                                                        <Link
                                                                            key={index}
                                                                            href={{pathname:`/${currLangCode}/categories-news/sub-category/${data?.slug}`,query: { language_id: currentLanguage && currentLanguage?.id }}}
                                                                            title={data.subcategory_name}
                                                                            onClick={() => setIsMenuOpen(false)}
                                                                            className='cursor-pointer w-max !max-w-full relative after:content-[""] after:absolute after:top-[1px] after:-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:primaryColor transition-all duration-500 hover:after:h-[88%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[600]'
                                                                        >
                                                                            {data.subcategory_name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </NavigationMenuContent>
                                                        </NavigationMenuItem>
                                                    </NavigationMenuList>
                                                </NavigationMenu>
                                                :
                                                <Link key={element?.slug}
                                                    href={{
                                                        pathname: `/${currLangCode}/categories-news/${element?.slug}`, query: { language_id: currentLanguage && currentLanguage?.id } 
                                                    }}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    title={element?.category_name} className='text-black font-[600]'>{element?.category_name}
                                                </Link>

                                        )
                                        )
                                    }
                                    {
                                        totalCategories > cateLimit && totalCategories !== categories?.length &&
                                        <span onClick={() => setCateOffset(1)} className='primaryColor font-[600] text-center cursor-pointer'>{translate('loadMore')}</span>
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>

            </div>
        </div >
    )
}

export default CatNav