'use client'
import { getAuthErrorMessage, translate } from '@/utils/helpers'
import React, { useState, useEffect } from 'react'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import toast from 'react-hot-toast'

const ForgotPasswordForm = ({ setForgotPassModal, setLoginModal }) => {

    const initialValues = { email: '', password: '' }
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState(
        '',
        setTimeout(() => {
            if (formErrors !== '') setFormErrors('')
        }, 5000)
    )
    const [isSubmit, setIsSubmit] = useState(false)

    const handleChange = e => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        // setFormErrors(validate(formValues))
        setFormErrors(formValues)
        setIsSubmit(true)
        const auth = getAuth()
        await sendPasswordResetEmail(auth, formValues.email)
            .then(userCredential => {
                toast.success(translate('passReset'))
                // ...
                setForgotPassModal(false)
                setLoginModal(true)
            })
            .catch(error => {
                console.log(error);
                var errorCode = error.code;
                var errorMessage = getAuthErrorMessage(errorCode);
                toast.error(errorMessage);
            })
    }
    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit); // eslint-disable-next-line
    }, [formErrors]) // eslint-disable-next-line

    return (
        <div className="p-6 pt-2">
            <div className="border-b borderColor pb-2">
                <h2 className="text-[22px] md:text-[36px] font-[700] textPrimary">{translate('forgotPassLbl')}</h2>
            </div>

            <div className="my-6 xl:mt-[130px]">
                <h5 className="text-[16px] md:text-[28px] font-[700] textPrimary">{translate('enteremail')}</h5>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                <div className="mb-4 border borderColor  p-2 commonRadius">
                    <label htmlFor="email" className="block font-[600] textSecondary">{translate('emailaddress')}</label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full textPrimary font-[600] bg-transparent focus:outline-none"
                        placeholder='name@example.com'
                        name='email'
                        value={formValues.email}
                        onChange={handleChange}
                    />
                </div>

                <button type='submit' className="commonBtn w-full text-[18px] md:text-[24px] mt-4">
                    {translate('submitBtn')}
                </button>
            </form>

        </div>
    )
}

export default ForgotPasswordForm