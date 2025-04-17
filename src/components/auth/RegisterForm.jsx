'use client'
import React from 'react'
import { useState, useEffect } from "react";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { getAuthErrorMessage, translate } from '@/utils/helpers';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth'
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { updateUserNameData } from '../store/reducers/userReducer';
import { FaArrowLeft } from 'react-icons/fa6';

const RegisterForm = ({ setLoginModal, setRegisterModal }) => {

    const [isPasswordVisible, setPasswordVisible] = useState({
        pass: false,
        confPass: false
    });

    const togglePasswordVisibility = (input) => {
        if (input === 'pass') {
            setPasswordVisible({ pass: !isPasswordVisible.pass });
        }
        if (input === 'confPass') {
            setPasswordVisible({ confPass: !isPasswordVisible.confPass });
        }
    };

    const initialValues = {
        username: '',
        email: '',
        password: '',
        confirmpassword: ''
    }
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState(
        '',
        setTimeout(() => {
            if (formErrors !== '') setFormErrors('')
        }, 5000)
    )
    const [isValidForm, setIsValidForm] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const auth = getAuth()

    const handleChange = e => {
        const { name, value } = e.target

        setFormValues({ ...formValues, [name]: value })
    }
    const handleConfirmpassword = e => {
        const { name, value } = e.target

        setFormValues({ ...formValues, [name]: value })
    }

    const navigate = useRouter()

    const handleSignup = async (email, password) => {
        // Set form errors
        setFormErrors(validate(formValues))

        // Check if there are no form errors
        if (Object.keys(formErrors).length === 0) {
            try {
                // Perform signup
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const user = userCredential.user

                // Send email verification
                sendEmailVerification(user)

                // // Sign out the user
                // signOut(auth)

                // Display success message
                toast.success(translate(`${translate('verifSentMail')}${formValues.email}`))
                updateUserNameData({ data: formValues?.username })
                setRegisterModal(false)
                setLoginModal(true)

                // Redirect to home or any other page
                navigate.push('/')
            } catch (error) {
                // Handle signup error
                handleError(error)
            }
        }
    }

    const handleError = error => {
        console.log(error);
        var errorCode = error.code;
        var errorMessage = getAuthErrorMessage(errorCode);
        toast.error(errorMessage);
    }

    useEffect(() => {
        setIsSubmit(true)
    }, [isValidForm])

    const handleSubmit = async e => {
        e.preventDefault()
        if (formValues.password === formValues.confirmpassword) {
            await handleSignup(formValues.email, formValues.password)

        }
        else {
            toast.error(translate('confPassNotMatch'))
        }
        setFormErrors(validate(formValues));
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit); // eslint-disable-next-line
    }, [formErrors])

    const validate = values => {
        const errors = {} // eslint-disable-next-line

        // const password_pattern = /^(?=.*\d)(?=.*\[a-z])(?=.*\[A-Z])[a-zA-Z0-9]{8,}$/
        if (!values.username) {
            errors.username = translate('nameRequired')
        }
        if (!values.password) {
            errors.password = translate('pwdRequired')
        } else if (values.password.length < 6) {
            errors.password = translate('pwdLength')
        }
        if (!values.confirmpassword) {
            errors.confirmPassword = translate('confPassRequired')
        } else if (values.confirmpassword === '' || values.confirmpassword !== values.password) {
            errors.confirmPassword = translate('confPassNotMatch')
        } else {
            setIsValidForm(true)
            navigate.push('/')
        }

        return errors
    }

    const handleBackToLogin = () => {
        setRegisterModal(false)
        setLoginModal(true)
    }


    return (
        <div className="p-6 pt-2">
            <div className="border-b borderColor pb-2">
                <h2 className="text-[22px] md:text-[36px] font-[700] textPrimary">{translate('createAccLbl')}</h2>
            </div>

            <div className="my-4 md:my-6">
                <h5 className="text-[18px] md:text-[22px] font-[700]">{translate('Welcome')}</h5>
                <p className="text-[14px] md:text-[16px] textPrimary font-[600]">{translate('register-daily-news')}</p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                {/* UserName */}
                <div className="mb border borderColor p-2 commonRadius">
                    <label htmlFor="username" className="block font-[600] textSecondary">{translate('username')}</label>
                    <input
                        type="text"
                        id="username"
                        className="mt-1 block w-full textPrimary font-[600] bg-transparent focus:outline-none"
                        placeholder={translate('nameLbl')}
                        name='username'
                        value={formValues.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                {
                    formErrors.username &&
                    <p className='text-red-600 text-sm mt-[-12px] mb-0'> {formErrors.username}</p>
                }

                {/* Email Address */}
                <div className="mb border borderColor  p-2 commonRadius">
                    <label htmlFor="email" className="block font-[600] textSecondary">{translate('emailaddress')}</label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full textPrimary font-[600] bg-transparent focus:outline-none"
                        name='email'
                        placeholder='name@example.com'
                        value={formValues.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                {
                    formErrors.email &&
                    <p className='text-red-600 text-sm mt-[-12px] mb-0'> {formErrors.email}</p>
                }

                {/* Password */}
                <div className="mb relative border borderColor  p-2 commonRadius">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">{translate('passLbl')}</label>
                    <input
                        type={isPasswordVisible.pass ? "text" : "password"}
                        id="password"
                        className="mt-1 block w-full textPrimary font-[600] bg-transparent focus:outline-none"
                        placeholder={translate('passLbl')}
                        name='password'
                        value={formValues.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('pass')}
                        className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center px-2 text-gray-500"
                    >
                        {isPasswordVisible.pass ? (
                            <IoEye size={24} />
                        ) : (
                            <IoMdEyeOff size={24} />
                        )}
                    </button>
                </div>
                {
                    formErrors.password &&
                    <p className='text-red-600 text-sm mt-[-12px] mb-0'> {formErrors.password}</p>
                }

                {/* Confirm Password */}
                <div className="mb relative border borderColor  p-2 commonRadius">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">{translate('confpassLbl')}</label>
                    <input
                        type={isPasswordVisible.confPass ? "text" : "password"}
                        id="password"
                        className="mt-1 block w-full textPrimary font-[600] bg-transparent focus:outline-none"
                        placeholder={translate('confpassLbl')}
                        name='confirmpassword'
                        value={formValues.confirmpassword}
                        onChange={handleConfirmpassword}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confPass')}
                        className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center px-2 text-gray-500"
                    >
                        {isPasswordVisible.confPass ? (
                            <IoEye size={24} />
                        ) : (
                            <IoMdEyeOff size={24} />
                        )}
                    </button>
                </div>
                {
                    formErrors.confirmpassword &&
                    <p className='text-red-600 text-sm mt-[-12px] mb-0'> {formErrors.confirmpassword}</p>
                }

                <button className="commonBtn w-full text-[18px] md:text-[24px] mt-1 md:mt-3">
                    {translate('signupLbl')}
                </button>
            </form>

            <div className='font-[600] text-lg mt-4 md:mt-7 flexCenter gap-2 cursor-pointer' onClick={() => handleBackToLogin()}>
                <FaArrowLeft size={16} className='mt-[2px]' />
                <span>{translate('backToLogin')}</span>
            </div>

        </div>
    )
}

export default RegisterForm