import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AiOutlineSearch } from 'react-icons/ai'
import Image from 'next/image'
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { useRouter } from 'next/router'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { getNewsApi } from '@/utils/api/api'
import LoadMoreBtn from '../commonComponents/loadermoreBtn/LoadmoreBtn'
import { currentLangCode, placeholderImage, translate, truncateText } from '@/utils/helpers'
import Skeleton from 'react-loading-skeleton'
import Link from 'next/link'

const SearchModal = ({ onClose = () => { } }) => {

    const currLangCode = currentLangCode();

    const [modalOpen, setModalOpen] = useState(false)

    const settingsData = useSelector(settingsSelector)
    const storedLatitude = settingsData?.lat;
    const storedLongitude = settingsData?.long;

    const currentLanguage = useSelector(currentLanguageSelector)

    const [searchValue, setSearchValue] = useState('')

    const [isLoading, setIsLoading] = useState({
        loading: false,
        loadMoreLoading: false
    })
    const [loadMore, setLoadMore] = useState(false)
    const [data, setData] = useState([])
    const [offset, setOffset] = useState(0)
    const [totalData, setTotalData] = useState('')

    const [currentPage, setCurrentPage] = useState(0)
    const dataPerPage = 4 // number of posts per page


    const handleLoadMore = () => {
        setLoadMore(true)
        setOffset(offset + 1)
    }
    const router = useRouter()
    const slug = router?.query?.slug

    const getSearchedNews = async () => {

        if (settingsData?.data?.lat || currentPage || searchValue) {
            !loadMore ? setIsLoading({ loading: true }) : setIsLoading({ loadMoreLoading: true })
            try {
                const { data } = await getNewsApi.getNews({
                    offset: offset * dataPerPage,
                    limit: dataPerPage,
                    language_id: currentLanguage?.id,
                    search: searchValue,
                    latitude: storedLatitude,
                    longitude: storedLongitude
                })
                // console.log('resData', data)
                setTotalData(data.total)
                setIsLoading({ loading: false })
                setIsLoading({ loadMoreLoading: false })
                if (loadMore) {
                    setData((prevData) => [...prevData, ...data?.data])
                }
                else {
                    setData(data?.data);
                }
                return data
            } catch (error) {
                console.log(error)
                setData([])
                setIsLoading({ loading: false })
            }
        }
    };

    useEffect(() => {
        if (searchValue && currentLanguage?.id) {
            const timeout = setTimeout(() => {
                getSearchedNews()
            }, 1500);
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [currentLanguage?.id, settingsData, searchValue, offset])

    useEffect(() => {
        // console.log('data', data)
    }, [totalData, isLoading, data, searchValue])

    useEffect(() => {
        setLoadMore(false)
        setOffset(0)
        setData([])
        setIsLoading({ loading: true })
    }, [searchValue])

    useEffect(() => {
        if (!modalOpen) {
            setSearchValue('')
            setData([])
        }

        if (modalOpen) {
            onClose()
        }

    }, [modalOpen])


    return (
        <div className=''>
            <Dialog open={modalOpen}>
                <DialogTrigger asChild onClick={() => setModalOpen(true)}>
                    <button className='commonBg dark:bg-white py-2 px-3 commonRadius transition-all duration-500 !primaryColor hover:!text-white hover:!hoverBg'><AiOutlineSearch size={23} /></button>
                </DialogTrigger>
                <DialogContent className="max-w-[80%] md:max-w-[50%] max-h-fit bg-white commonRadius p-0 border-none searchModalWrapper overflow-hidden">
                    <div className='flex flex-col'>
                        <div className='flex items-center justify-between w-full px-3 pe-0 border-none'>
                            <input type="text" placeholder={translate('search')} className='w-full text-black focus:outline-none text-[18px]' onChange={(e) => setSearchValue(e.target.value)} />
                            <button className='primaryBg max-w-fit h-[50px] px-[14px] text-white' onClick={() => setModalOpen(false)}><IoClose size={24} /></button>
                        </div>

                        {
                            searchValue !== '' &&
                            <div className='flex flex-col gap-6 bg-[#212529] p-3 max-h-[450px] overflow-hidden searchContentWrapper overflow-y-scroll'>

                                {
                                    isLoading.loading ? [...Array(3)].map((_, index) => (
                                        <div className='flex items-center gap-3'>
                                            <div className='w-[70px] h-[70px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px] object-cover commonRadius'>
                                                <Skeleton className='h-full w-full' />
                                            </div>
                                            <div className='w-full'>
                                                <Skeleton height={40} className='w-full' />
                                            </div>
                                        </div>
                                    )) :
                                        searchValue !== '' &&
                                            data && data.length > 0 ?
                                            data?.map((element) => {
                                                return <Link key={element?.id}
                                                    href={{ pathname: `/${currLangCode}/news/${element?.slug}`, query: { language_id: element?.language_id } }}
                                                    title='detail-page'
                                                >
                                                    <div className='flex items-center gap-3 text-white font-[600] text-lg'>
                                                        <Image src={element?.image} onError={placeholderImage} alt={element?.title} loading='lazy' width={0} height={0} className='w-[70px] h-[70px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px] object-cover commonRadius' />
                                                        <h1 className='line-clamp-2'>{truncateText(element.title, 150)}</h1>
                                                    </div>
                                                </Link>
                                            })
                                            :
                                            !isLoading.loading &&
                                            <div className='text-white flexCenter h-[450px] overflow-hidden font-[600] text-lg'>
                                                {translate('nodatafound')}
                                            </div>
                                }
                                {!isLoading.loading && searchValue && totalData > dataPerPage && totalData !== data.length ? (
                                    <div className='flexCenter'>
                                        <LoadMoreBtn handleLoadMore={handleLoadMore} loadMoreLoading={isLoading.loadMoreLoading} />
                                    </div>
                                ) : null}
                            </div>
                        }

                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SearchModal