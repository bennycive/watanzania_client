'use client'
import React, { useState } from 'react'
import { IoReorderThree } from "react-icons/io5";
import ProfileDropdown from '../dropdowns/ProfileDropdown';
import LanguageDropdown from '../dropdowns/LanguageDropdown';
import { BiBell } from 'react-icons/bi'
import ThemeToggler from '../topBar/ThemeToggler';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { settingsSelector } from '../store/reducers/settingsReducer';
import { checkNewsDataSelector } from '../store/reducers/CheckNewsDataReducer';
import MorePagesDropdown from '../dropdowns/MorePagesDropdown';
import { currentLanguageSelector, languagesListSelector } from '../store/reducers/languageReducer';
import { currentLangCode, isLogin, setCateOffset, translate } from '@/utils/helpers';
import { userDataSelector } from '../store/reducers/userReducer';
import LoginModal from '../auth/LoginModal';
import SearchModal from '../search/SearchModal';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { categoriesSelector, categoryLimit, totalCates } from '../store/reducers/CategoriesReducer';

const MobileNav = ({ userRole, handleAlert, totalMorePages, morePagesOffset, setMorePagesOffset, setIsLoadMorePages, morePagesLimit }) => {

    const currLangCode = currentLangCode();

    const categories = useSelector(categoriesSelector);
    const cateLimit = useSelector(categoryLimit);
    const totalCategories = useSelector(totalCates);

    const [isMenuOpen, setIsMenuOpen] = useState(true);
    let userName = '';

    const checkUserData = userData => {
        if (userData?.data && userData?.data?.name !== '') {
            return (userName = userData?.data?.name)
        } else if (userData?.data && userData?.data?.email !== '') {
            return (userName = userData?.data?.email)
        } else if (userData?.data && (userData?.data?.mobile !== null || userData?.data?.mobile !== '')) {
            return (userName = userData?.data?.mobile)
        }
    }

    const userData = useSelector(userDataSelector)
    const languagesData = useSelector(languagesListSelector)
    const currentLanguage = useSelector(currentLanguageSelector)
    const settingsData = useSelector(settingsSelector);
    const checkNewsData = useSelector(checkNewsDataSelector);
    const router = usePathname()

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <span onClick={showDrawer} className='dark:text-white cursor-pointer'><IoReorderThree size={44} /></span>
                </SheetTrigger>
                <SheetContent onOpenChange={onClose} open={open} className='!bodyBgColor overflow-y-scroll'>
                    <div className='flex flex-col gap-6 mt-6'>
                        <div className='flex items-center gap-6 flex-wrap'>
                            {
                                isLogin() && checkUserData(userData) ?
                                    <ProfileDropdown userName={userName} userRole={userRole} handleAlert={handleAlert} onClose={onClose} mobileNav={true} />
                                    :
                                    <LoginModal onClose={onClose} />
                            }
                            <ThemeToggler mobileNav={true} />

                        </div>
                        <div className='flex items-center gap-6 flex-wrap'>
                            {
                                router === '/' && languagesData?.length > 1 &&
                                <LanguageDropdown mobileNav={true} onClose={onClose} />
                            }
                            {
                                isLogin() &&
                                <div>
                                    <Link href={`/${currLangCode}/personal-notification`} onClick={onClose}>
                                        <button className='commonBg dark:bg-white hover:!hoverBg py-2 px-3 commonRadius transition-all duration-500 !primaryColor hover:!text-white hover:hoverBg relative after:content-[""] after:absolute after:top-2 after:right-2 after:primaryBg after:h-[5px] after:w-[5px] after:rounded-full'><BiBell size={23} /></button>
                                    </Link>
                                </div>
                            }
                            <div>
                                <SearchModal onClose={onClose} />
                            </div>
                        </div>
                        <div className="navLinks">
                            <ul className='flex flex-col gap-3'>
                                <li className='list-none'>
                                    <Link href={'/'} title={translate('home')} className={`${router === '/' ? 'activeLink after:h-[94%]' : ''} relative after:content-[""] after:absolute after:top-[1px] after:-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s]  textPrimary uppercase font-[500]`} onClick={onClose}>{translate('home')}</Link>
                                </li>
                                <li className='list-none'>
                                    <Link href={{ pathname: `/${currLangCode}/about-us`, query: { language_id: currentLanguage && currentLanguage?.id } }} className={`${router === `/${currLangCode}/about-us` ? 'activeLink after:h-[94%]' : ''} relative after:content-[""] after:absolute after:top-[1px] after:-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s]  textPrimary uppercase font-[500]`} onClick={onClose} title={translate('aboutus')}>{translate('aboutus')}</Link>
                                </li>
                                {
                                    settingsData && settingsData?.data?.live_streaming_mode === '1' && checkNewsData && checkNewsData?.data?.isLiveNewsData &&
                                    <li className='list-none'>
                                        <Link href={{ pathname: `/${currLangCode}/live-news`, query: { language_id: currentLanguage && currentLanguage?.id } }}  className={`${router === `/${currLangCode}/live-news` ? 'activeLink after:h-[94%]' : ''} relative after:content-[""] after:absolute after:top-[1px] after:-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s]  textPrimary uppercase font-[500]`} onClick={onClose} title={translate('livenews')}>{translate('livenews')}</Link>
                                    </li>
                                }

                                {
                                    settingsData && settingsData?.data?.breaking_news_mode === '1' && checkNewsData && checkNewsData?.data?.isBreakingNewsData &&
                                    <li className='list-none'>
                                        <Link href={{ pathname: `/${currLangCode}/all-breaking-news`, query: { language_id: currentLanguage && currentLanguage?.id } }} className={`${router === `/${currLangCode}/all-breaking-news` ? 'activeLink after:h-[94%]' : ''} relative after:content-[""] after:absolute after:top-[1px] after:-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s]  textPrimary uppercase font-[500]`} onClick={onClose} title={translate('breakingnews')}>{translate('breakingnews')}</Link>
                                    </li>
                                }
                                <li className='list-none'>
                                    <Link href={{ pathname: `/${currLangCode}/video-news`, query: { language_id: currentLanguage && currentLanguage?.id } }} className={`${router === `/${currLangCode}/video-news` ? 'activeLink after:h-[94%]' : ''} relative after:content-[""] after:absolute after:top-[1px] after:-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s]  textPrimary uppercase font-[500]`} onClick={onClose} title={translate('videosLbl')}>{translate('videosLbl')}</Link>
                                </li>
                                <li className='list-none'>
                                    <Link href={{ pathname: `/${currLangCode}/contact-us`, query: { language_id: currentLanguage && currentLanguage?.id } }} className={`${router === `/${currLangCode}/contact-us` ? 'activeLink after:h-[94%]' : ''} relative after:content-[""] after:absolute after:top-[1px] after:-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s]  textPrimary uppercase font-[500]`} onClick={onClose} title={translate('contactus')}>{translate('contactus')}</Link>
                                </li>
                                <li className='list-none'>
                                    <MorePagesDropdown onClose={onClose} totalMorePages={totalMorePages} morePagesOffset={morePagesOffset} setMorePagesOffset={setMorePagesOffset} setIsLoadMorePages={setIsLoadMorePages} morePagesLimit={morePagesLimit} />
                                </li>
                            </ul>
                        </div>

                        <div className='relative'>
                            <div className={`flex items-center justify-between text-lg textPrimary font-[700] cursor-pointer`} onClick={() => setIsMenuOpen(isMenuOpen ? false : true)}>
                                <h1>{translate('categories')}</h1>
                                <span className='primaryBg p-2 rounded-full text-white flexCenter'>
                                    {isMenuOpen ? <FaAngleUp /> : <FaAngleDown />}
                                </span>
                            </div>
                            {
                                isMenuOpen &&
                                <div className='otherCats mobileCates overflow-y-scroll max-h-[344px] pb-6 flex flex-col gap-3  absolute bg-transparent textPrimary w-full mt-[12px]'>
                                    {
                                        categories?.map((element) =>
                                        (
                                            element?.sub_categories?.length > 0 ?
                                                <NavigationMenu key={element?.id}>
                                                    <NavigationMenuList>
                                                        <NavigationMenuItem>
                                                            <NavigationMenuTrigger className='bg-transparent dropdownTrigg p-0 h-max w-max'><span className='textPrimary font-[600] flex items-center gap-1 cursor-pointer'>
                                                                {element.category_name}
                                                            </span></NavigationMenuTrigger>
                                                            <NavigationMenuContent className='w-full bg-white relative z-[1]'>
                                                                <div className='flex flex-col gap-3 !w-full max-w-full py-2 px-4'>
                                                                    {element.sub_categories.map((data, index) => (
                                                                        <Link
                                                                            key={index}
                                                                            href={`/${currLangCode}/categories-news/sub-category/${data?.slug}`}
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
                                                        pathname: `/${currLangCode}/categories-news/${element?.slug}`
                                                    }}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    title={element?.category_name} className='textPrimary font-[600]'>{element?.category_name}
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

                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileNav