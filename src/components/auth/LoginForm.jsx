'use client'
import { useState, useEffect } from "react";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { FaGoogle } from "react-icons/fa";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import FirebaseData from '@/utils/Firebase';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    getAuth,
    sendEmailVerification
} from 'firebase/auth'
import { registertokenApi, userSignUpApi } from '@/utils/api/api';
import { useSelector } from 'react-redux';
import { settingsSelector } from '../store/reducers/settingsReducer';
import toast from 'react-hot-toast';
import { currentLangCode, getAuthErrorMessage, translate } from '@/utils/helpers';
import { useRouter } from 'next/router';
import { currentLanguageSelector } from '../store/reducers/languageReducer';
import { setUserData } from '../store/reducers/userReducer';

const LoginForm = ({ setRegisterModal, setPhoneLogin, setLoginModal, setForgotPassModal, setMainModal }) => {

    const currLangCode = currentLangCode();

    const settingsData = useSelector(settingsSelector)

    const currentLanguage = useSelector(currentLanguageSelector)

    const storedLatitude = settingsData?.lat;
    const storedLongitude = settingsData?.long;

    const navigate = useRouter()
    const [isSubmit, setIsSubmit] = useState(false)
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const initialValues = { email: '', password: '' }
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState(
        '',
        setTimeout(() => {
            if (formErrors !== '') setFormErrors('')
        }, 5000)
    )

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const handleOpenRegisterModal = () => {
        setLoginModal(false)
        setRegisterModal(true)
    }

    const handleOpenForgotPassModal = () => {
        setLoginModal(false)
        setForgotPassModal(true)
    }

    const handleOpenPhoneLogin = () => {
        setLoginModal(false)
        setForgotPassModal(false)
        setPhoneLogin(true)
    }

    const handleChange = e => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    }

    // form submit
    const handleSubmit = e => {
        e.preventDefault()
        setFormErrors(validate(formValues))
        setIsSubmit(true)
    }

    // validate email
    const validate = values => {
        const errors = {}
        if (!values.password) {
            errors.password = translate('pwdRequired')
        } else if (values.password.length < 6) {
            errors.password = translate('pwdLength')
        }
        return errors
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit);
    }, [formErrors, isSubmit])

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


    const registerUser = async (userId, displayName, email, type, profile,) => {
        if (settingsData?.fcmtoken) {
            try {
                const response = await userSignUpApi.userSignup({
                    firebase_id: userId,
                    name: displayName,
                    email: email,
                    type: type,
                    profile: profile,
                    status: '1',
                    fcm_id: settingsData?.fcmtoken,
                });

                toast.success(translate('loginMsg'))
                setUserData({ data: response?.data?.data, profileUpdate: false, profileImageUpdate: false })

                if (response?.data?.data?.fcm_id && currentLanguage?.id) {
                    setTimeout(async () => {
                        await registerToken(response?.data?.data?.fcm_id)
                    }, [1000])
                }

                if (response.data.is_login === '0') {
                    //If new User then show the Update Profile Screen
                    navigate.push(`/${currLangCode}/profile-update`)
                }
                setMainModal(false)

            } catch (error) {
                console.error('Error:', error);
                toast.error(translate('deactiveMsg'))
            } finally {
            }
        }
    };


    const { authentication, messaging } = FirebaseData()
    const auth = getAuth()

    // sign in google
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(authentication, provider)
            .then(async response => {
                setLoginModal(false)
                await registerUser(response?.user?.uid, response?.user?.displayName, response?.user?.email, 'gmail', response?.user?.photoURL)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    // sign in with email and password
    const signInWithEmail = async () => {
        if (formValues.email && formValues.password) {
            await signInWithEmailAndPassword(auth, formValues.email, formValues.password)
                .then(async userCredential => {
                    // Signed in
                    const user = userCredential.user
                    if (user.emailVerified) {
                        registerUser(user?.uid, user?.displayName, formValues?.email, 'email', user?.photoURL)
                    } else {
                        toast.error(translate('verifyEmailMsg'))
                        sendEmailVerification(auth.currentUser)
                    }
                    setMainModal(false)
                })
                .catch(function (error) {
                    console.log(error);
                    var errorCode = error.code;
                    var errorMessage = getAuthErrorMessage(errorCode);
                    toast.error(errorMessage);
                })
        }
    }

    return (
        <div className="p-6 pt-2">
            <div className="border-b borderColor pb-2">
                <h2 className="text-[22px] md:text-[36px] font-[700] textPrimary">{translate('loginTxt')}</h2>
            </div>

            <div className="my-4 md:my-6">
                <h5 className="text-[18px] md:text-[22px] font-[700]">{translate('welcomeback')}</h5>
                <p className="text-[14px] md:text-[16px] textPrimary font-[600]"> {translate('enter-email-password')}</p>
            </div>

            <div className="flex flex-col gap-2">

                <form className='' onSubmit={handleSubmit}>
                    {/* Email Address */}
                    <div className="mb-4 border borderColor  p-2 commonRadius">
                        <label htmlFor="email" className="block font-[600] textSecondary">{translate('emailaddress')}</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full textPrimary font-[600] bg-transparent focus:outline-none"
                            value={formValues.email}
                            onChange={handleChange}
                            required
                            name='email'
                            placeholder='name@example.com'
                            aria-describedby='emailHelp'
                        />
                    </div>
                    {
                        formErrors.email &&
                        <p className='text-red-600 text-sm mt-[-12px] mb-2'> {formErrors.email}</p>
                    }

                    {/* Password */}
                    <div className="mb-1 relative border borderColor  p-2 commonRadius">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">{translate('passLbl')}</label>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            className="mt-1 block w-full textPrimary font-[600] bg-transparent focus:outline-none"
                            name='password'
                            value={formValues.password}
                            onChange={handleChange}
                              placeholder={translate('passLbl')}
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center px-2 text-gray-500"
                        >
                            {isPasswordVisible ? (
                                <IoEye size={24} />
                            ) : (
                                <IoMdEyeOff size={24} />
                            )}
                        </button>
                    </div>
                    {
                        formErrors.password &&
                        <p className='text-red-600 text-sm my-0'> {formErrors.password}</p>
                    }

                    {/* Forgot Password */}
                    <div className="flex justify-end mb-5">
                        <span className="font-[500] text-[#fa3232] cursor-pointer" onClick={handleOpenForgotPassModal}>{translate('forgotPassLbl')}</span>
                    </div>
                    {/* Login Button */}
                    <button className="commonBtn w-full text-[18px] md:text-[24px] md:mt-4" onClick={signInWithEmail}>
                        {translate('loginTxt')}
                    </button>
                </form>


            </div>


            {/* OR Divider */}
            <div className="relative my-2 md:my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border borderColor mt-[1px]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 md:p-2 bodyBgColor textPrimary text-[18px] font-[600]">{translate('or')}</span>
                </div>
            </div>
            <div className={`grid grid-cols-1  ${settingsData?.data?.mobile_login_mode === '1' ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4`}>

                {/* Google Sign-In Button */}
                <button className="w-full text-white py-2 commonRadius primaryBg font-[700]" onClick={signInWithGoogle}>
                    <span className="inline-block align-middle mr-1"><FaGoogle size={12} /></span> {translate('signin-with-google')}
                </button>

                {/* PhoneLogin Button  */}
                {
                    settingsData?.data?.mobile_login_mode === '1' &&
                    <button className="w-full text-white py-2 commonRadius secondaryBg font-[700]" onClick={handleOpenPhoneLogin}>
                        <span className="inline-block align-middle mr-1"><MdOutlinePhoneAndroid size={16} /></span> {translate('signin-with-phone')}
                    </button>
                }

            </div>


            {/* Register */}
            <div className="flexCenter flex-col mt-4 md:mt-8 text-[18px]">
                <span className="font-[600] textPrimary">  {translate('donthaveacc_lbl')}</span>
                <span className="font-[700] text-[#3b5998] cursor-pointer" onClick={handleOpenRegisterModal}> {translate('register')}</span>
            </div>
        </div>
    )
}

export default LoginForm