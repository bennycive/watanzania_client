'use client'
import React from 'react'
import { useState } from "react";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { translate } from '@/utils/helpers';
import OptModal from './OtpModal';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { settingsSelector } from '../store/reducers/settingsReducer';

const PhoneLogin = (setMainModal) => {

    const settingsData = useSelector(settingsSelector)

    const [phonenum, setPhonenum] = useState(null)
    const [optModal, setOptModal] = useState(false)

    // const navigate = useRouter();

    const [value, setValue] = useState()
    const [error, setError] = useState(
        '',
        setTimeout(() => {
            if (error !== '') setError('')
        }, 5000)
    )

    // const darkThemeMode = useSelector(themeSelector);

    // Load the libphonenumber library
    const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

    // Validate a phone number
    const validatePhoneNumber = phone_number => {
        try {
            const parsedNumber = phoneUtil.parse(phone_number)
            return phoneUtil.isValidNumber(parsedNumber)
        } catch (err) {
            return false
        }
    }

    const handleGetOtp = e => {
        e.preventDefault()
        if (value === undefined) {
            toast.error(translate('mblRequired'))
        } else if (validatePhoneNumber(value)) {
            setPhonenum(value)
            setOptModal(true)
        } else {
            toast.error(translate('mblValid'))
        }
    }

    return (
        !optModal ?
            <div className="p-6 pt-2">
                <div className="border-b borderColor pb-2">
                    <h2 className="text-[22px] md:text-[36px] font-[700] textPrimary">{translate('loginTxt')}</h2>
                </div>


                <div className="my-6 xl:mt-24">
                    <h5 className="text-[18px] md:text-[22px] font-[700] textPrimary">{translate('enter-your-mobile-number')}</h5>
                    <p className="text-[14px] md:text-[16px] textPrimary font-[600]">{translate('six-didgit-code')}</p>
                </div>

                <div className="flex flex-col gap-2">

                    <div className="mb-4 border borderColor md:p-1 commonRadius">
                        <PhoneInput
                            className='py-2 phoneInput'
                            placeholder='Enter your phone number'
                            defaultCountry={settingsData && settingsData?.data?.country_code ? settingsData?.data?.country_code : process.env.NEXT_PUBLIC_DEFAULT_COUNTRY}
                            international
                            value={value}
                            onChange={setValue}
                        />
                    </div>
                </div>

                <form onClick={e => handleGetOtp(e)}>
                    {/* Login Button */}
                    <button className="commonBtn w-full text-[18px] md:text-[24px] mt-4">
                        {translate('reqOtpLbl')}
                    </button>
                </form>
            </div>
            :
            <OptModal
                setPhonenum={setPhonenum}
                setValue={setValue}
                phonenum={phonenum}
                setMainModal={setMainModal}
            />

    )
}

export default PhoneLogin