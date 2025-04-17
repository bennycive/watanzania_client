'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import cookieIconLight from '../../assets/Images/CookieIcon.svg'
import cookieIconDark from '../../assets/Images/CookieIconDarkTheme.svg'
import { useSelector } from 'react-redux'
import { themeSelector } from '../store/reducers/CheckThemeReducer'
import { userDataSelector } from '../store/reducers/userReducer'
import Cookies from 'js-cookie';
import { isLogin, placeholderImage, translate } from '@/utils/helpers'

const CookiesComponent = () => {


    const [showPopup, setShowPopup] = useState(false);

    const [isCookiesAccept, setIsCookiesAccept] = useState(false)

    const darkTheme = useSelector(themeSelector)

    const userData = useSelector(userDataSelector)

    const isUserLogin = isLogin()

    const expirationDays = 7;

    const handleAccept = () => {
        Cookies.set('cookie-consent', 'accepted', { expires: expirationDays });

        setShowPopup(false);
        setIsCookiesAccept(true)
        handleSaveData()
    };

    const handleDecline = () => {
        Cookies.set('cookie-consent', 'declined', { expires: expirationDays });
        setShowPopup(false);
    };

    const handleSaveData = () => {
        Cookies.set('user-name', userData?.data?.name, { expires: expirationDays })
        Cookies.set('user-email', userData?.data?.email, { expires: expirationDays })
        Cookies.set('user-number', userData?.data?.mobile, { expires: expirationDays })
        Cookies.set('user-token', userData?.data?.token, { expires: expirationDays })
        Cookies.set('user-fcmId', userData?.data?.fcm_id, { expires: expirationDays })
        Cookies.set('user-loginType', userData?.data?.type, { expires: expirationDays })
    }


    useEffect(() => {
        const consent = Cookies.get('cookie-consent');
        if (!consent) {
            setShowPopup(true);
        }
    }, []);

    useEffect(() => {
        const storedUsername = Cookies.get('user-name');
        if (isUserLogin && isCookiesAccept) {
            handleSaveData()
            console.log('cookiesStoredUsername', storedUsername);
        }
    }, [isUserLogin, showPopup, userData]);

    if (!showPopup) return null;




    return (
        <div className='bodyBgColor dark:secondaryBg flexCenter flex-col gap-6 items-center text-center fixed 
        bottom-[10px] right-[10px] 
        md:bottom-[20px] md:right-[20px]
        p-[20px] md:p-[50px] lg:py-[185px] lg:px-[60px] 
        w-[300px] h-[420px] sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px]
        lg:w-[640px] lg:h-[366px] 
        shadow-[0px_0px_50px_#1B2D511A] dark:shadow-[0px_0px_50px_#6c757d2b] z-[999] commonRadius'>
            <div>
                <Image src={darkTheme ? cookieIconDark : cookieIconLight} height={0} width={0} alt='cookie-icon' loading='lazy' className='h-[70px] w-[70px]' onError={placeholderImage}/>
            </div>
            <div className='flex flex-col gap-3'>
                <span className='textPrimary text-lg md:text-xl lg:text-2xl font-[700]'>{translate('allCokkies')}</span>
                <span className='textSecondary text-[14px] sm:text-[16px] font-[600]'>{translate('weUseCokkies')}</span>
            </div>

            <div className="flex items-center flex-wrap sm:flex-nowrap justify-center gap-4 sm:gap-6 mt-3 sm:mt-8">
                <button onClick={handleDecline} className='bg-transparent border py-2 px-3 secondaryBorder dark:border-white commonRadius textPrimary font-[600]'>{translate('declineCokkies')}</button>
                <button onClick={handleAccept} className='secondaryBg dark:bg-white dark:text-black border py-2 px-3 secondaryBorder commonRadius text-white font-[600]'>{translate('acceptCokkies')}</button>
            </div>
        </div>
    )
}

export default CookiesComponent