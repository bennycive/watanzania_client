'use client'
import React, { useEffect } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { currentLanguageLabelSelector, currentLanguageSelector, languagesListSelector, setCurrentLanguageLabelData, setLanguageChangeData, setLanguagesListData } from '../store/reducers/languageReducer';
import { getLanguageJsonDataApi, getLanguagesApi, registertokenApi } from '@/utils/api/api';
import { settingsSelector } from '../store/reducers/settingsReducer';
import moment from 'moment';
import toast from 'react-hot-toast';
import { isLogin, isManualRefresh, setCateOffset } from '@/utils/helpers';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"


const LanguageDropdown = ({ mobileNav, onClose = () => { } }) => {

    const settingsData = useSelector(settingsSelector)
    const languagesData = useSelector(languagesListSelector)
    const currentLanguage = useSelector(currentLanguageSelector)
    const languagesList = useSelector(languagesListSelector)
    const currentLanguageLabelsData = useSelector(currentLanguageLabelSelector)

    const languagesLabelDiffInMinutes = currentLanguageLabelsData?.lastFetch ? moment().diff(moment(currentLanguageLabelsData?.lastFetch), 'minutes') : process.env.NEXT_PUBLIC_LOAD_MIN + 1;

    const storedLatitude = settingsData?.lat;
    const storedLongitude = settingsData?.long;

    const fetchLanguages = async () => {
        try {
            console.log('Running fetchLanguages...');
            
            const response = await getLanguagesApi.getLanguages({
                language_id: currentLanguage?.id,
            });
            const data = response.data;
            setLanguagesListData({ data: data?.data });
    
            console.log('data:', data);
            console.log('currentLanguage:', currentLanguage);
            console.log('typeof currentLanguage?.code:', typeof currentLanguage?.code);
            console.log('null check:', currentLanguage?.code == null); // `== null` handles both `null` & `undefined`
    
            if (currentLanguage?.code == null) {  
                console.log('Inside if block');
    
                let index = data?.data.find(item => 
                    item?.code === settingsData?.data?.default_language?.code
                );
    
                console.log('index:', index);
    
                if (index) {
                    console.log('Setting language:', index);
                    setLanguageChangeData(index.language, index.code, index.id);
                } else {
                    console.warn("Default language not found in the list.");
                }
            } else {
                console.log("Condition not met, skipping language setting.");
            }
    
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const fetchLanguagesJsonData = async (code) => {
        try {
            const response = await getLanguageJsonDataApi.getLanguageJsonData({
                code: code,
            });

            const data = response.data?.data;
            setCurrentLanguageLabelData(data, Date.now())

        } catch (error) {
            console.error('Error:', error);
        } finally {
        }
    };

    const registerToken = async (fcmId) => {
        if (fcmId) {
            try {
                const response = await registertokenApi.registertoken({
                    language_id: currentLanguage?.id,
                    token: fcmId,
                    latitude: storedLatitude,
                    longitude: storedLongitude
                });
            } catch (error) {
                console.error('registerFcmTokenApi Error :', error);
            } finally {
            }
        }
        else {
            console.log('fcmId not found')
        }
    };

    // language change
    const languageChange = async (name, code, id, display_name) => {
        fetchLanguagesJsonData(code)
        setLanguageChangeData(name, code, id, display_name)
        onClose()
        if (isLogin() && settingsData?.fcmtoken) {
            registerToken(settingsData?.fcmtoken)
        }
    }

    useEffect(() => {
        if (settingsData) {
            fetchLanguages()
        }
    }, [currentLanguage]);

    useEffect(() => {
        if (languagesList?.length < 2 && languagesLabelDiffInMinutes || isManualRefresh()) {
            fetchLanguagesJsonData(settingsData?.data?.default_language?.code)
            setLanguageChangeData(settingsData?.data?.default_language?.language, settingsData?.data?.default_language?.code, settingsData?.data?.default_language?.id, settingsData?.data?.default_language?.display_name)
        }
    }, [settingsData])

    const handleLanguageChange = (e, language, code, id, display_name) => {
        e?.preventDefault()
        languageChange(language, code, id, display_name)
        setCateOffset(0)
    }

    // set rtl
    const selectedLang = languagesData && languagesData.find(lang => lang.code === currentLanguage?.code)
    useEffect(() => {
        if (selectedLang && selectedLang.isRTL === 1) {
            document.documentElement.dir = 'rtl'
            document.documentElement.lang = `${selectedLang && selectedLang.code}`
        } else {
            document.documentElement.dir = 'ltr'
            document.documentElement.lang = `${selectedLang && selectedLang.code}`
        }
    }, [selectedLang])

    return (
        languagesData?.length > 1 &&
        <>
            <NavigationMenu className={`relative ${mobileNav ? '!z-[10]' : '!z-[12]'}`}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className='py-[2px] px-[12px] rouded-[4px] h-auto dropdownTrigg font-[600] text-base uppercase bg-white text-black'>{currentLanguage?.displayName
                            ? currentLanguage?.displayName
                            : currentLanguage?.name}</NavigationMenuTrigger>
                        <NavigationMenuContent className='w-full bg-white'>
                            <div className='flex flex-col gap-3 !w-full max-w-full p-2 pb-3 px-4'>
                                {
                                    languagesList && languagesList?.map((data, index) => {
                                        return <NavigationMenuLink className='block cursor-pointer w-max !max-w-full relative after:content-[""] after:absolute after:top-[1px] after:-left-[8px] after:h-[0%] after:w-[4px] after:rounded-full after:primaryBg hover:primaryColor transition-all duration-500 hover:after:h-[88%] hover:after:transition-all hover:after:duration-[0.3s] text-black font-[500]' key={index}
                                            onClick={(e) => handleLanguageChange(e, data.language, data.code, data.id, data.display_name)}
                                        >
                                            {
                                                data?.display_name ? data?.display_name : data?.language
                                            }
                                        </NavigationMenuLink>
                                    })
                                }
                            </div>

                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </>


    );
}
export default LanguageDropdown;