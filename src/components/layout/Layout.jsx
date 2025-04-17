'use client'
// const TopBar = dynamic(() => import('../topBar/TopBar.jsx'), { ssr: false })
import TopBar from '../topBar/TopBar.jsx'
import Header from './Header.jsx'
import CatNav from './CatNav.jsx'
const Footer = dynamic(() => import('./Footer.jsx'), { ssr: false })
import { useEffect, useState } from 'react'
import { getBreaingNewsApi, getCategoriesApi, getLiveNewsApi, getMorePagesApi, getSettingsApi, getUserByIdApi } from '@/utils/api/api.js'
import Loader from '../commonComponents/Loader.jsx'
import { setSettingsData, setSettingsLastFetch, settingsLastFetchSelector, settingsSelector } from '../store/reducers/settingsReducer.js'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment";
import { isManualRefresh, placeholderImage, setCateOffset, translate } from '@/utils/helpers.jsx'
import { morePagesSelector, setMorePagesData } from '../store/reducers/morePagesReducer.js'
import { currentLanguageSelector } from '../store/reducers/languageReducer.js'
import { checkBreakingNewsData, checkLiveNewsData } from '../store/reducers/CheckNewsDataReducer.js'
import dynamic from 'next/dynamic.js'
import { logoutUser, setUserManageData, userDataSelector } from '../store/reducers/userReducer.js'
import { themeSelector } from '../store/reducers/CheckThemeReducer.js'
import CookiesComponent from '../cookies/CookiesComponent.jsx'
import { categoriesSelector, categoryLimit, categoryOffset, IsLoadMoreCates, setCategoriesData, setTotalCates } from '../store/reducers/CategoriesReducer.js'
import { useRouter } from 'next/router.js'
import { usePathname } from 'next/navigation.js'
import { manageNewsRoutes, protectedRoutes } from '../routes/routes.jsx'
import toast from 'react-hot-toast'
import Image from 'next/image.js'


import maintenanceModeDark from '../../assets/Images/Maintenance_Mode_Dark.svg'
import maintenanceModeLight from '../../assets/Images/Maintenance_Mode_Light.svg'
import { signOut } from 'firebase/auth'
import FirebaseData from '@/utils/Firebase.js'

const Layout = ({ children }) => {

    const [loading, setLoading] = useState(false);

    const settingsData = useSelector(settingsSelector);

    const darkThemeMode = useSelector(themeSelector);

    const maintenanceMode = settingsData?.data?.maintenance_mode;

    const cookiesMode = settingsData?.data?.web_setting?.accept_cookie;

    const userData = useSelector(userDataSelector);

    const { authentication } = FirebaseData();

    const userRole = userData?.userManageData?.data?.role;

    const settingsLastFetch = useSelector(settingsLastFetchSelector);

    const currentLanguage = useSelector(currentLanguageSelector);
    const categoriesData = useSelector(categoriesSelector)
    const isLoadMoreCategories = useSelector(IsLoadMoreCates);
    const cateLimit = useSelector(categoryLimit);
    const cateOffset = useSelector(categoryOffset);

    useEffect(() => {
    }, [cateOffset])

    const morePagesData = useSelector(morePagesSelector);

    const [totalMorePages, setTotalMorePages] = useState(0);
    const morePagesLimit = 10;
    const [morePagesOffset, setMorePagesOffset] = useState(0)
    const [isLoadMorePages, setIsLoadMorePages] = useState(false)

    const dispatch = useDispatch();

    const router = useRouter();
    const pathname = usePathname();

    const settingsDiffInMinutes = settingsLastFetch ? moment().diff(moment(settingsLastFetch), 'minutes') : process.env.NEXT_PUBLIC_LOAD_MIN + 1;

    // Check if the user is authenticated based on the presence of the token
    const isAuthenticated = userData && userData?.data?.token;

    // Check if the current route requires authentication
    const requiresAuth = protectedRoutes.includes(pathname)

    const manageUserRoleRoutes = manageNewsRoutes.includes(pathname);

    const rssFeedMode = settingsData && settingsData?.data?.rss_feed_mode;
    const rssPageRoute = pathname.startsWith('/rss-feed');


    useEffect(() => {
        if (rssPageRoute && rssFeedMode !== '1') {
            router.push('/')
            toast.error(translate('pageNotEnable'))
        }
    }, [rssFeedMode])

    useEffect(() => {
        authCheck()
    }, [requiresAuth])
    useEffect(() => {
        checkUserRole()
    }, [manageUserRoleRoutes])

    const authCheck = () => {
        if (requiresAuth) {
            if (isAuthenticated === undefined) {
                router.push('/')
                toast.error(translate('loginFirst'))
                return
            }
        }
    }

    const checkUserRole = () => {
        if (manageUserRoleRoutes) {
            if (userRole == 0) {
                router.push('/')
                toast.error(translate('dontHaverPermission'))
            }
        }
    }

    // client side rendering route get and this is only for vercel deploy logic
    useEffect(() => {
        // Check if the slug is present in the URL
        if (process.env.NEXT_PUBLIC_SEO === 'false') {
            if (router.pathname) {
                router.replace(window.location.pathname + window.location.search)
            }
        }
    }, [])

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const { data } = await getSettingsApi.getSettings({
                type: 'settingofworld',
            });
            if (!data?.error) {
                setSettingsData({ data: data?.data })
                setSettingsLastFetch({ data: Date.now() })
            }
            else {
                console.log("settings error =>", data?.message)
            }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false)
        }
    };

    // category 
    const firstLoadCate = sessionStorage.getItem('firstLoad_Cate')
    const manualRefreshCate = sessionStorage.getItem('manualRefresh_Cate')

    const shouldFetchCategories = !firstLoadCate || manualRefreshCate === 'true'


    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('manualRefresh_Cate', 'true')
        })

        window.addEventListener('load', () => {
            // Check if this is a manual refresh by checking if lastFetch is set
            if (!sessionStorage.getItem('lastFetch_Cate')) {
                sessionStorage.setItem('manualRefresh_Cate', 'true')
            }
        })
    }

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const { data } = await getCategoriesApi.getCategories({
                offset: shouldFetchCategories ? 0 : cateOffset * cateLimit,
                limit: cateLimit,
                language_id: currentLanguage?.id,
            });

            if (!data?.error) {
                setTotalCates({ data: data.total })
                if (isLoadMoreCategories) {
                    setCategoriesData({ data: [...categoriesData, ...data?.data] })
                }
                else {
                    setCategoriesData({ data: data?.data }) // to store categories in redux
                }
                // console.log(data)
                sessionStorage.setItem('lastFetch_Cate', Date.now())
            }
            else {
                setCategoriesData({ data: [] })
                console.log('categories error =>', data?.message)
            }

        } catch (error) {
            setCategoriesData({ data: [] })
            console.error('Error:', error);
        } finally {
            setLoading(false)
        }
    };


    // morePages 
    const firstLoadMorePages = sessionStorage.getItem('firstLoad_MorePages')
    const manualRefreshMorePages = sessionStorage.getItem('manualRefresh_MorePages')

    const shouldFetchMorePages = !firstLoadMorePages || manualRefreshMorePages === 'true'


    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('manualRefresh_MorePages', 'true')
        })

        window.addEventListener('load', () => {
            // Check if this is a manual refresh by checking if lastFetch is set
            if (!sessionStorage.getItem('lastFetch_MorePages')) {
                sessionStorage.setItem('manualRefresh_MorePages', 'true')
            }
        })
    }
    const fetchMorePages = async () => {
        try {
            setLoading(true)
            const { data } = await getMorePagesApi.getMorePages({
                language_id: currentLanguage?.id,
                offset: morePagesOffset * morePagesLimit,
                limit: morePagesLimit
            });
            if (!data?.error) {
                setTotalMorePages(data?.total)
                if (isLoadMorePages) {
                    setMorePagesData({ data: [...morePagesData, ...data?.data] })
                }
                else {
                    setMorePagesData({ data: data?.data })
                }
                sessionStorage.setItem('lastFetch_MorePages', Date.now())
                // console.log("morePages =>", data?.data)
            }
            else {
                console.log('error =>', data?.message);
                setMorePagesData({ data: [] })
            }


        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false)
        }
    };

    // live news 
    const firstLoad = sessionStorage.getItem('firstLoad_LiveNews')
    const manualRefresh = sessionStorage.getItem('manualRefresh_LiveNews')

    const shouldFetchLiveNewsData = !firstLoad || manualRefresh === 'true'


    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('manualRefresh_LiveNews', 'true')
        })

        window.addEventListener('load', () => {
            // Check if this is a manual refresh by checking if lastFetch is set
            if (!sessionStorage.getItem('lastFetch_LiveNews')) {
                sessionStorage.setItem('manualRefresh_LiveNews', 'true')
            }
        })
    }

    const fetchLiveNews = async () => {
        try {
            setLoading(true)
            const { data } = await getLiveNewsApi.getLiveNews({
                language_id: currentLanguage.id
            });
            if (!data?.error) {
                dispatch(checkLiveNewsData({ data: { liveNewsDataFound: data?.data?.length > 0 ? true : false } }))
                sessionStorage.setItem('lastFetch_LiveNews', Date.now())
            }
            else {
                console.log('liveNews error =>', data?.message)
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false)
        }
    };

    // breaking news 
    const firstLoadBreakingNews = sessionStorage.getItem('firstLoad_BreakingNews')
    const manualRefreshBreakingNews = sessionStorage.getItem('manualRefresh_BreakingNews')

    const shouldFetchBreakingNewsData = !firstLoadBreakingNews || manualRefreshBreakingNews === 'true'



    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('manualRefresh_BreakingNews', 'true')
        })

        window.addEventListener('load', () => {
            // Check if this is a manual refresh by checking if lastFetch is set
            if (!sessionStorage.getItem('lastFetch_BreakingNews')) {
                sessionStorage.setItem('manualRefresh_BreakingNews', 'true')
            }
        })
    }

    const fetchBreakingNews = async () => {
        try {
            setLoading(true)
            const { data } = await getBreaingNewsApi.getBreakingNews({
                language_id: currentLanguage.id
            });
            if (!data?.error) {
                dispatch(checkBreakingNewsData({ data: { breakingNewsDataFound: data?.data?.length > 0 ? true : false } }))
                sessionStorage.setItem('lastFetch_BreakingNews', Date.now())
            }
            else {
                console.log('breakingNews error =>', data?.message)
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        if (settingsDiffInMinutes > process.env.NEXT_PUBLIC_LOAD_MIN || isManualRefresh()) {
            fetchSettings()
        }
    }, []);

    useEffect(() => {
        if (darkThemeMode) {
            document.documentElement.style.setProperty('--secondary-color', settingsData && settingsData?.data?.web_setting?.dark_secondary_color)
            document.documentElement.style.setProperty('--body-color', settingsData && settingsData?.data?.web_setting?.dark_body_color)
            document.documentElement.style.setProperty('--primary-color', settingsData && settingsData?.data?.web_setting?.dark_primary_color)
            document.documentElement.style.setProperty('--hover--color', settingsData && settingsData?.data?.web_setting?.dark_hover_color)
            document.documentElement.style.setProperty('--text-primary-color', settingsData && settingsData?.data?.web_setting?.dark_text_primary_color)
            document.documentElement.style.setProperty('--text-secondary-color', settingsData && settingsData?.data?.web_setting?.dark_text_secondary_color)
        }
        else {
            document.documentElement.style.setProperty('--secondary-color', settingsData && settingsData?.data?.web_setting?.light_secondary_color)
            document.documentElement.style.setProperty('--body-color', settingsData && settingsData?.data?.web_setting?.light_body_color)
            document.documentElement.style.setProperty('--primary-color', settingsData && settingsData?.data?.web_setting?.light_primary_color)
            document.documentElement.style.setProperty('--hover--color', settingsData && settingsData?.data?.web_setting?.light_hover_color)
            document.documentElement.style.setProperty('--text-primary-color', settingsData && settingsData?.data?.web_setting?.light_text_primary_color)
            document.documentElement.style.setProperty('--text-secondary-color', settingsData && settingsData?.data?.web_setting?.light_text_secondary_color)
        }
    }, [settingsData, darkThemeMode])

    useEffect(() => {
        if (currentLanguage?.id) {
            const prevLanguageId = sessionStorage.getItem('curentLangId')
            if (morePagesData && morePagesData.length < 1 || shouldFetchMorePages || Number(prevLanguageId) !== currentLanguage.id || isLoadMorePages) {
                fetchMorePages()
                sessionStorage.removeItem('manualRefresh_MorePages')
                // Set firstLoad flag to prevent subsequent calls
                sessionStorage.setItem('firstLoad_MorePages', 'true')
            }
        }
    }, [currentLanguage, morePagesOffset]);

    useEffect(() => {

        if (shouldFetchCategories) {
            // console.log('set -> 0)');
            // console.log('cateOffset =>', cateOffset);
      
            setCateOffset(0);
          }

        if (currentLanguage?.id) {
            const prevLanguageId = sessionStorage.getItem('curentLangId')
            if (settingsData?.data?.category_mode === '1' && shouldFetchCategories || Number(prevLanguageId) !== currentLanguage.id || isLoadMoreCategories) {
                fetchCategories();
                sessionStorage.removeItem('manualRefresh_Cate')
                // Set firstLoad flag to prevent subsequent calls
                sessionStorage.setItem('firstLoad_Cate', 'true')
            }
        }
    }, [currentLanguage, cateOffset, settingsData]);



    useEffect(() => {
        if (currentLanguage?.id) {
            const prevLanguageId = sessionStorage.getItem('curentLangId')
            if (settingsData?.data?.live_streaming_mode === '1' && shouldFetchLiveNewsData || Number(prevLanguageId) !== currentLanguage.id) {
                fetchLiveNews()
                sessionStorage.removeItem('manualRefresh_LiveNews')
                // Set firstLoad flag to prevent subsequent calls
                sessionStorage.setItem('firstLoad_LiveNews', 'true')
            }
            if (settingsData?.data?.breaking_news_mode === '1' && shouldFetchBreakingNewsData || Number(prevLanguageId) !== currentLanguage.id) {
                fetchBreakingNews()
                sessionStorage.removeItem('manualRefresh_BreakingNews')
                // Set firstLoad flag to prevent subsequent calls
                sessionStorage.setItem('firstLoad_BreakingNews', 'true')
            }
            sessionStorage.setItem('curentLangId', currentLanguage?.id)
        }

    }, [currentLanguage, settingsData?.data?.live_streaming_mode, settingsData?.data?.breaking_news_mode])

    const GetUserByIdFetchData = async () => {
        if (!userData.data?.firebase_id) return false
        try {
            const { data } = await getUserByIdApi.getUserById({
            });

            if (!data?.error) {
                setUserManageData({ data: data?.data })
                if (data && data.status === 0) {
                    toast.error(translate('deactiveMsg'))
                    signOut(authentication)
                        .then(() => {
                            logoutUser()
                            window.recaptchaVerifier = null
                            router.push('/')
                            // toast.success(translate('loginOutMsg'))
                        })
                        .catch(error => {
                            toast.error(error.message || 'An error occurred while signing out.')
                        })
                    return false
                }
            }
            else {
                console.log('getUser error =>', data?.message)
            }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        GetUserByIdFetchData()
    }, [currentLanguage, userData.data?.firebase_id]);

    useEffect(() => {
        const handleCopy = (e) => {
            e.preventDefault();
        };
        document.addEventListener('copy', handleCopy);
        return () => {
            document.removeEventListener('copy', handleCopy);
        };
    }, []);


    return (
        <>
            {
                settingsData ? maintenanceMode === '1' ? <div className='flexColumnCenter h-screen textPrimary text-xl md:text-2xl lg:text-3xl text-center'>
                    <div>
                        {
                            darkThemeMode ?
                                <Image loading="lazy" src={maintenanceModeDark} alt="underMaintanceImg" width={0} height={0} className='w-[250px] md:w-[500px]' onError={placeholderImage} /> :
                                <Image loading="lazy" src={maintenanceModeLight} alt="underMaintanceImg" width={0} height={0} className='w-[250px] md:w-[500px]' onError={placeholderImage} />
                        }
                    </div>
                    <div className='mt-[30px]'>
                        <h1 className='font-[700]'>
                            {translate("underMaintance")}
                        </h1>
                    </div>
                    <div className='mt-[20px]'>
                        <h2 className='font-[600] w-full sm:w-[62%] m-auto'>
                            {translate("pleaseTryagain")}
                        </h2>
                    </div>
                </div>
                    :
                    <>
                        <TopBar />
                        <Header totalMorePages={totalMorePages} morePagesLimit={morePagesLimit} morePagesOffset={morePagesOffset} setMorePagesOffset={setMorePagesOffset} setIsLoadMorePages={setIsLoadMorePages} />
                        <CatNav />
                        {children}
                        {
                            cookiesMode === '1' &&
                            <CookiesComponent />
                        }
                        <Footer />
                    </>
                    :
                    <Loader />
            }
        </>
    )
}

export default Layout