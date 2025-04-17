'use client'
import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Image from 'next/image';
import UserBasedCatSkeleton from '../skeletons/UserBasedCatSkeleton';
import { useSelector } from 'react-redux';
import { getCategoriesApi, getUserByIdApi, setUserCategoriesApi } from '@/utils/api/api';
import { currentLanguageSelector } from '../store/reducers/languageReducer';
import { logoutUser, setUserManageData, userDataSelector } from '../store/reducers/userReducer';
import { NoDataFound, placeholderImage, setCateOffset, translate } from '@/utils/helpers';
import toast from 'react-hot-toast';
import LoadMoreSpinner from '../commonComponents/loadermoreBtn/LoaderSpinner';
import { signOut } from 'firebase/auth';
import FirebaseData from '@/utils/Firebase';
import { useRouter } from 'next/router';
import { categoriesSelector, categoryLimit, totalCates } from '../store/reducers/CategoriesReducer';

const UserBasedCategories = () => {

    const currentLanguage = useSelector(currentLanguageSelector);
    const categories = useSelector(categoriesSelector);
    const cateLimit = useSelector(categoryLimit);
    const totalCategories = useSelector(totalCates);
    const userData = useSelector(userDataSelector)

    const { authentication } = FirebaseData();

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [finalToggleID, setFinalToggleID] = useState('')

    const [loader, setLoader] = useState(false);

    const navigate = useRouter();

    // handle switch
    const handleSwitchChange = id => {
        setData((prevData) => {
            const newData = prevData.map((element) => {
                if (element.id === id) {
                    return { ...element, isToggledOn: !element.isToggledOn };
                }
                return element;
            });

            const toggledIds = newData
                .filter((element) => element.isToggledOn)
                .map((element) => element.id);

            const finalToggleID = toggledIds.length === 0 ? 0 : toggledIds.join(',');
            setFinalToggleID(finalToggleID);


            return newData;
        });
    };

    useEffect(() => {
        const toggledData = categories?.map(element => {
            // here set isToggleOn has boolean with actual data

            const isToggledOn = userData && userData?.userManageData?.data?.user_category?.category_id?.includes(element.id)

            return { ...element, isToggledOn }
        })
        setData(toggledData)
        setLoading(false)
    }, [currentLanguage?.id], categories)

    const getUserById = async () => {
        try {
            const response = await getUserByIdApi.getUserById({
            })
            setUserManageData({ data: response?.data?.data })

            if (response && response.data.status === 0) {
                toast.error(translate('deactiveMsg'))
                signOut(authentication)
                    .then(() => {
                        logoutUser()
                        window.recaptchaVerifier = null
                        navigate.push('/')
                        // toast.success(translate('loginOutMsg'))
                    })
                    .catch(error => {
                        toast.error(error.message || 'An error occurred while signing out.')
                    })
                return false
            }
        } catch (error) {
            console.log(error)
        }
    }


    // here final submit button
    const finalSubmit = async (e) => {
        e.preventDefault()
        setLoader(true)
        // Check if there are any changes in the toggle state
        if (finalToggleID !== '') {
            try {
                const { data } = await setUserCategoriesApi.setUserCategories({
                    category_id: finalToggleID
                })
                toast.success(data?.message)
                getUserById()
                setLoader(false)
            } catch (error) {
                setData([])
                setLoading(false)
                console.log(error)
            }

        } else {
            // No changes in toggle state, you can handle this case (optional)
            setLoader(false)
            toast.error(translate('selectcategory'))
        }
    }


    return (
        <Layout>
            <>
                {/* <Breadcrumb secondElement={'user based cat'} /> */}

                <section className='userBasedCategories container mt-8 md:mt-12 pb-12'>
                    {
                        loading ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, index) => (
                                <div key={index}>
                                    <UserBasedCatSkeleton />
                                </div>
                            ))}
                        </div>

                            : data && data?.length > 0 ?
                                <>
                                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                                        {
                                            data?.map((element) => {
                                                return <div className='flex items-center justify-between border borderColor rounded-[10px] p-2 gap-3 sm:p-4 sm:gap-0 md:p-2 md:gap-3 lg:p-4 lg:gap-0' key={element?.id}>
                                                    <div>
                                                        <Image src={element?.image} height={0} width={0} onError={placeholderImage} alt='category-img' loading='lazy' className='h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] rounded-[10px]' />
                                                    </div>
                                                    <div>
                                                        <h1 className='textPrimary text-[18px] lg:text-[22px] font-[600]'>{element?.category_name}</h1>
                                                    </div>
                                                    <div>
                                                        <div
                                                            onClick={() => handleSwitchChange(element?.id)}
                                                            className={`relative  w-[80px] md:w-[80px] lg:w-[100px] sm:w-[100px] h-[40px] flex items-center commonRadius cursor-pointer transition-all duration-300 ${element?.isToggledOn ? 'bg-[#4CAF50]' : 'bg-[#f44336]'
                                                                }`}
                                                        >
                                                            {/* Slider */}
                                                            <div
                                                                className={`absolute left-1 top-1 h-[80%] w-[26px] commonRadius bg-white border-2 transition-transform duration-300 transform ${element?.isToggledOn ? 'translate-x-[46px] sm:translate-x-[65px] lg:translate-x-[65px] md:translate-x-[46px]' : 'translate-x-0'
                                                                    }`}
                                                            ></div>
                                                            <span className={`absolute right-[12px] font-semibold text-white text-sm transition-opacity duration-300 ${element?.isToggledOn ? 'opacity-0' : 'opacity-100'}`}>OFF</span>
                                                            <span className={`absolute left-[12px] font-semibold text-white text-sm transition-opacity duration-300 ${element?.isToggledOn ? 'opacity-100' : 'opacity-0'}`}>ON</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                        }

                                    </div>
                                    <div className='mt-12 flexCenter'>
                                        {
                                            finalToggleID !== '' ?
                                                loader ? <button className='commonBtn text-[18px]'><LoadMoreSpinner /></button> :
                                                    <button type='submit' className='commonBtn text-[18px]' onClick={e => finalSubmit(e)}>{translate('saveLbl')}</button>
                                                :
                                                totalCategories > cateLimit && totalCategories !== categories?.length &&
                                                <button className='commonBtn text-[18px]' onClick={() => setCateOffset(1)}>{translate('loadMore')}</button>
                                        }
                                    </div>
                                </>

                                :
                                <NoDataFound />
                    }
                </section>
            </>
        </Layout>
    );
}

export default UserBasedCategories;
