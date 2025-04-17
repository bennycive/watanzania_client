'use client'
import React from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import Link from 'next/link';
import Image from 'next/image';
import profileImg from '../../assets/Images/user.svg'
import { usePathname } from 'next/navigation';
import { currentLangCode, placeholderImage, translate, truncateText } from '@/utils/helpers';
import { useSelector } from 'react-redux';
import { userDataSelector } from '../store/reducers/userReducer';

const ProfileDropdown = ({ userName, userRole, handleAlert, onClose, mobileNav }) => {

    const currLangCode = currentLangCode();
    const router = usePathname();
    const userData = useSelector(userDataSelector)

    const items = [
        {
            key: '1',
            label: (
                <Link href={`/${currLangCode}/bookmark`} title={translate('bookmark')} className={`${router === `/${currLangCode}/bookmark` ? 'activeLink after:h-[94%]' : ''}  relative after:content-[""] after:absolute after:top-[1px] after:!-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:!primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[500] my-1 text-[17px]`} onClick={onClose}>
                    {translate('bookmark')}
                </Link >
            ),
        },
        {
            key: '2',
            label: (
                <Link href={`/${currLangCode}/user-based-categories`} title={translate('managePreferences')} className={`${router === `/${currLangCode}/user-based-categories` ? 'activeLink after:h-[94%]' : ''}  relative after:content-[""] after:absolute after:top-[1px] after:!-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:!primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[500] my-1 text-[17px]`} onClick={onClose}>
                    {translate('managePreferences')}
                </Link >
            ),
        },
        {
            key: '3',
            label: (
                <Link href={`/${currLangCode}/profile-update`} title={translate('update-profile')} className={`${router === `/${currLangCode}/profile-update` ? 'activeLink after:h-[94%]' : ''}  relative after:content-[""] after:absolute after:top-[1px] after:!-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:!primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[500] my-1 text-[17px]`} onClick={onClose}>
                    {translate('update-profile')}
                </Link >
            ),
        },
        ...(userRole?.role != 0 ? [
            {
                key: '4',
                label: (
                    <Link href={`/${currLangCode}/create-news`} title={translate('createNewsLbl')} className={`${router === `/${currLangCode}/create-news` ? 'activeLink after:h-[94%]' : ''}  relative after:content-[""] after:absolute after:top-[1px] after:!-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:!primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[500] my-1 text-[17px]`} onClick={onClose}>
                        {translate('createNewsLbl')}
                    </Link >
                ),
            },
            {
                key: '5',
                label: (
                    <Link href={`/${currLangCode}/manage-news`} title={translate('manageNewsLbl')} className={`${router === `/${currLangCode}/manage-news` ? 'activeLink after:h-[94%]' : ''}  relative after:content-[""] after:absolute after:top-[1px] after:!-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:!primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[500] my-1 text-[17px]`} onClick={onClose}>
                        {translate('manageNewsLbl')}
                    </Link >
                ),
            },
        ] : []),

        {
            key: '6',
            label: (
                <span className={`${router === '' ? 'activeLink after:h-[94%]' : ''}  relative after:content-[""] after:absolute after:top-[1px] after:!-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:!primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[500] my-1 text-[17px]`} onClick={() => handleAlert('deleteAcc')}
                >
                    {translate('deleteAcc')}
                </span>
            ),
        },
        {
            key: '7',
            label: (
                <span className={`${router === '' ? 'activeLink after:h-[94%]' : ''}  relative after:content-[""] after:absolute after:top-[1px] after:!-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:!primaryColor transition-all duration-500 hover:after:h-[94%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[500] my-1 text-[17px]`} onClick={() => handleAlert('logoutAcc')}
                >
                    {translate('logout')}
                </span>
            ),
        },
    ];

    return (
        <NavigationMenu className={`relative ${mobileNav ? '!z-[12]' : '!z-[10]'}`}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="flexCenter rtl:flex-row-reverse py-2 px-3 gap-1 dropdownTrigg commonRadius commonDropDown commonBg dark:bg-white dark:text-black w-max text-[17px] !font-[500]">
                        <Image src={userData?.data?.profile ? userData?.data?.profile : profileImg} height={24} width={24} alt='profile' className='rounded-full me-1' onError={placeholderImage} loading='lazy' />
                        {truncateText(userName, 10)}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className='w-full bg-white'>
                        <div className='flex flex-col gap-3 !w-full max-w-full p-2 pb-3 px-4'>
                            {
                                items.map((link, index) => {
                                    return <NavigationMenuLink key={index} className='w-max cursor-pointer'>{link.label}</NavigationMenuLink>
                                })
                            }
                        </div>

                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
};
export default ProfileDropdown;