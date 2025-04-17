'use client'
import React, { useState } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import Image from 'next/image'
import porfileSectImg from '../../assets/Images/Profile.svg'
import { FaCamera } from 'react-icons/fa'
import { currentLangCode, placeholderImage, translate } from '@/utils/helpers'
import { useRouter } from 'next/router'
import { setUserData, userDataSelector, userNameSelector } from '../store/reducers/userReducer'
import { useSelector } from 'react-redux'
import usersvg from '../../assets/Images/user.svg'
import validator from 'validator'
import { updateProfileApi } from '@/utils/api/api'
import toast from 'react-hot-toast'

const ProfileUpdate = () => {

    const currLangCode = currentLangCode();
    const router = useRouter()
    const userData = useSelector(userDataSelector)
    const [isMobileValid, setIsMobileValid] = useState(true) // State to track mobile number validity
    const [isEmailValid, setIsEmailValid] = useState(true) // State to track email address validity

    const userName = useSelector(userNameSelector)

    const [profileData, setProfileData] = useState({
        name: userName ? userName : userData.data?.name ? userData.data?.name : '',
        mobile: userData ? userData.data?.mobile : '',
        email: userData ? userData.data?.email : ''
    })

    // handle profile change
    const handleImageChange = async e => {
        e.preventDefault()
        const selectedFile = e.target.files[0]
        // Check if a file is selected
        if (!selectedFile) {
            return
        }
        // Check if the selected file type is an image
        if (!selectedFile.type.startsWith('image/')) {
            toast.error('Please select an image file.')
            return
        }

        if (!JSON.parse(process.env.NEXT_PUBLIC_DEMO)) {

            // setProfileData(prevState => ({ ...prevState, image: selectedFile }))
            try {
                const { data } = await updateProfileApi.updateProfile({
                    image: selectedFile
                })
                setUserData({ data: data?.data, profileUpdate: false, profileImageUpdate: true })
            } catch (error) {
                toast.error(error)
            }
        }
    }

    const handleChange = e => {
        const field_name = e.target.name
        const field_value = e.target.value
        setProfileData(values => ({ ...values, [field_name]: field_value }))
    }

    // validate
    const validateNumber = e => {
        const enteredValue = e.target.value

        // Check if the entered value is an empty string
        if (enteredValue === '') {
            // If the mobile number is removed, set the 'mobile' field in 'profileData' to null
            setProfileData(prevState => ({ ...prevState, mobile: null }))
            setIsMobileValid(true) // Reset the mobile number validity when it's empty
        } else {
            // Otherwise, update the 'mobile' field with the entered value
            setProfileData(prevState => ({ ...prevState, mobile: enteredValue }))

            // Validate mobile if the entered value is not empty
            setIsMobileValid(validator.isMobilePhone(enteredValue)) // Set the mobile number validity flag
        }
    }

    const validateEmail = e => {
        const enteredValue = e.target.value

        // Check if the entered value is an empty string
        if (enteredValue === '') {
            // If the email address is removed, set the 'email' field in 'profileData' to null
            setProfileData(prevState => ({ ...prevState, email: null }))
            setIsEmailValid(true) // Reset the email address validity when it's empty
        } else {
            // Otherwise, update the 'email' field with the entered value
            setProfileData(prevState => ({ ...prevState, email: enteredValue }))

            // Validate email if the entered value is not empty
            setIsEmailValid(validator.isEmail(enteredValue)) // Set the email address validity flag
        }
    }

    // update profile button
    const formDetails = async e => {
        e.preventDefault()

        if (profileData?.name === '') {
            toast.error('Please enter your name')
            return
        }

        // Validate email only when it's not empty
        if (!isEmailValid) {
            toast.error('Enter a valid email address')
            return
        }

        // Validate mobile only when it's not empty
        if (!isMobileValid) {
            toast.error('Enter a valid phone number')
            return
        }

        if (!JSON.parse(process.env.NEXT_PUBLIC_DEMO)) {
            try {
                const { data } = await updateProfileApi.updateProfile({
                    name: profileData.name,
                    mobile: profileData.mobile,
                    email: profileData.email,
                })


                if (!data?.error) {
                    setUserData({ data: data?.data, profileUpdate: true, profileImageUpdate: false })
                    toast.success(translate('profileUpdateMsg'))
                    userData?.data?.is_login === "0" ? router.push(`/${currLangCode}/user-based-categories`) : router.push('/');
                }
                else {
                    console.log(data?.message)
                }
            } catch (error) {
                toast.error(error)
            }

        } else {
            toast.error(translate('Profile update is not allowed in demo version.'))
            router.push('/')
        }

    }

    return (
        <Layout>
            <>
                <Breadcrumb secondElement={translate('update-profile')} />

                <section className='updateProfile container mt-8 md:mt-12'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        <div className='flexCenter'>
                            <Image src={porfileSectImg} alt='update-profile' loading='lazy' height={0} width={0} className='h-auto w-auto' onError={placeholderImage} />
                        </div>

                        <div className='flex items-center justify-center'>
                            <div className="w-full p-6 border borderColor rounded-[16px] ">
                                <div className="flex flex-col items-center">
                                    {/* Profile Image */}
                                    <div className="relative">
                                        <img
                                            src={userData.data && userData.data.profile ? userData.data.profile : usersvg.src}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                                        />
                                        {/* Camera Icon for Upload */}
                                        <label
                                            htmlFor="profileImageInput"
                                            className="absolute bottom-0 right-0 primaryBg h-8 w-8 flexCenter rounded-full p-1 text-white cursor-pointer"
                                        >
                                            <FaCamera />
                                        </label>
                                        {/* Hidden Input for File */}
                                        <input
                                            type="file"
                                            id="profileImageInput"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>

                                    {/* Profile Info */}
                                    <div className="mt-16 flex flex-col gap-8 w-full">
                                        <div className="border borderColor rounded-[8px] p-2 textPrimary">
                                            <label className="block text-[14px] font-[400]">{translate('your-name')}</label>
                                            <input
                                                type="text"
                                                name='name'
                                                id='name'
                                                className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none"
                                                defaultValue={userName && userName ? userName : userData.data && userData.data?.name}
                                                onChange={e => handleChange(e)}
                                                required
                                            />
                                        </div>

                                        <div className="border borderColor rounded-[8px] p-2 textPrimary">
                                            <label className="block text-[14px] font-[400]">{translate('emailLbl')}</label>
                                            {
                                                userData && userData.mobileLoginType ?
                                                    <input
                                                        type="email"
                                                        className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none"
                                                        defaultValue={userData.data && userData.data.email}
                                                        onChange={e => validateEmail(e)}
                                                    /> :
                                                    <input
                                                        type="email"
                                                        className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none cursor-not-allowed"
                                                        placeholder={userData.data && userData.data.email}
                                                        readOnly
                                                    />
                                            }
                                        </div>
                                        <div className="border borderColor rounded-[8px] p-2 textPrimary">
                                            <label className="block text-[14px] font-[400]">{translate('mobileLbl')}</label>
                                            {
                                                userData && userData.mobileLoginType ?
                                                    <input
                                                        type='number'
                                                        name='mobile'
                                                        id='mobile'
                                                        min='0'
                                                        className="w-full font-[600] bg-transparent text px-2 mt-2 focus:outline-none cursor-not-allowed"
                                                        placeholder={userData.data && userData.data && userData.data.mobile}
                                                        readOnly
                                                    /> :
                                                    <input
                                                        type="number"
                                                        name='mobile'
                                                        id='mobile'
                                                        className="w-full font-[600] !bg-transparent text px-2 mt-2 focus:outline-none"
                                                        min='0'
                                                        max='12'
                                                        defaultValue={userData.data && userData.data.mobile}
                                                        onChange={e => validateNumber(e)}
                                                    />
                                            }
                                        </div>
                                        <div>
                                            <button className='commonBtn m-auto w-full text-[18px] !py-3' onClick={e => formDetails(e)}> {translate('update-profile')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        </Layout>
    )
}

export default ProfileUpdate