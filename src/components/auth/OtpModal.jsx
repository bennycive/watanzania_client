import React, { useState, useEffect } from 'react'
import OTPInput from 'react-otp-input'
import { currentLangCode, translate } from '@/utils/helpers'
import FirebaseData from '@/utils/Firebase'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { setIsMobileLogin, setUserData } from '../store/reducers/userReducer'
import toast from 'react-hot-toast'
import { registertokenApi, userSignUpApi } from '@/utils/api/api'
import { currentLanguageSelector } from '../store/reducers/languageReducer'

const OptModal = (props) => {

  const currLangCode = currentLangCode();
  const [OTP, setOTP] = useState('')
  const { authentication } = FirebaseData()
  const settingsData = useSelector(settingsSelector)
  const storedLatitude = settingsData?.lat;
  const storedLongitude = settingsData?.long;
  const currentLanguage = useSelector(currentLanguageSelector)

  const navigate = useRouter()

  // const darkThemeMode = useSelector(themeSelector);

  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    let intervalId;

    if (resendTimer > 0) {
      intervalId = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [resendTimer]);


  const resendOTP = e => {
    e.preventDefault()
    // Reset the resendTimer to 60 seconds
    if (props.phonenum !== null) {
      generateOTP(props.phonenum)
      setResendTimer(60);
    }
  }

  const generateRecaptcha = () => {
    if (typeof window !== 'undefined') {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(authentication, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('recaptcha resolved..')
          }
        });
      }
    }
  }

  useEffect(() => {
    generateRecaptcha()
  }, [])

  const generateOTP = async phonenum => {
    // OTP Generation
    generateRecaptcha()
    let appVerifier = window.recaptchaVerifier
    await signInWithPhoneNumber(authentication, phonenum, appVerifier)
      .then(confirmationResult => {
        window.confirmationResult = confirmationResult
        toast.success(`${translate('otpSentLbl')} ${phonenum}`);
        setIsMobileLogin({ data: true })
      })
      .catch(error => {
        let errorMessage = ''
        switch (error.code) {
          case 'auth/too-many-requests':
            errorMessage = 'Too many requests. Please try again later.'
            break
          case 'auth/invalid-phone-number':
            errorMessage = 'Invalid phone number. Please enter a valid phone number.'
            break
          default:
            errorMessage = 'An error occurred. Please try again.'
            break
        }
        // Display error message in a toast or alert
        toast.error(errorMessage)
      })
  }
  useEffect(() => {
    if (props.phonenum !== null) {
      generateOTP(props.phonenum)
    }
    // eslint-disable-next-line
  }, [props.phonenum])

  // handle otp error codes
  const handleAuthenticationError = errorCode => {
    switch (errorCode) {
      case 'auth/missing-verification-code':
        toast.error('Missing verification code. Please enter the code.')
        break

      case 'auth/code-expired':
        toast.error('The verification code has expired. Please generate a new one.')
        break

      case 'auth/invalid-verification-code':
        toast.error('Invalid verification code. Please enter a valid code.')
        break

      case 'auth/invalid-verification-id':
        toast.error('Invalid verification ID. Please try again with a valid ID.')
        break

      case 'auth/session-expired':
        toast.error('The session has expired. Please sign in again.')
        break

      case 'auth/quota-exceeded':
        toast.error('Quota exceeded. Please wait before sending a new verification code.')
        break

      default:
        toast.error('An unknown authentication error occurred.')
        break
    }
  }

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


  const registerUser = async (userId, mobile) => {
    if (settingsData?.fcmtoken) {
      try {
        const response = await userSignUpApi.userSignup({
          firebase_id: userId,
          mobile: mobile,
          type: 'mobile',
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
        props.setMainModal(false)
        recaptchaClear()

      } catch (error) {
        console.error('Error:', error);
        toast.error(translate('deactiveMsg'))
      } finally {
      }
    }
  };


  const submitOTP = async e => {
    e.preventDefault()

    let confirmationResult = window.confirmationResult

    try {
      const response = await confirmationResult.confirm(OTP)
      props.setMainModal(false)
      recaptchaClear()
      registerUser(response.user.uid, response.user.phoneNumber)
    } catch (error) {
      handleAuthenticationError(error.code)
    }
  }

  const recaptchaClear = async () => {
    const recaptchaContainer = document.getElementById('recaptcha-container')
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = ''
    }

    if (window.recaptchaVerifier) {
      window?.recaptchaVerifier?.recaptcha?.reset()
    }
  }


  return (
    <div className="p-6 pt-2">
      <div className="border-b borderColor pb-2">
        <h2 className="text-[22px] md:text-[36px] font-[700] textPrimary">{translate('opt-verify')}</h2>
      </div>


      <div className="my-6 xl:mt-24">
        <h5 className="text-[18px] md:text-[22px] font-[700] textPrimary">{translate('otp-sent')} </h5>
        <p className="text-[14px] md:text-[16px] textPrimary font-[600]">{props.phonenum}</p>
      </div>

      <div className="flex flex-col gap-2">

        <div className="mb-4 md:p-1 commonRadius otp-content">
          <OTPInput
            className='otp-container'
            value={OTP}
            onChange={setOTP}
            autoFocus
            numInputs={6}
            disabled={false}
            containerStyle={'otpbox'}
            renderSeparator={<span className='space'></span>}
            renderInput={props => <input {...props} className='custom-input-class'></input>}
          />
        </div>
        {resendTimer > 0 ? (
          <div className='flex items-center gap-1 font-[500]'>
            <span className="textPrimary"> {translate("resendCodeIn")}</span>
            <span className="text-[red]" >
              {" "}
              {resendTimer} {translate("seconds")}
            </span>
          </div>
        ) : (
          <button onClick={e => resendOTP(e)} className='text-start textPrimary font-[500]'>
            {translate('resendLbl')}
          </button>
        )}
      </div>

      <form onClick={e => submitOTP(e)}>
        {/* Login Button */}
        <button className="commonBtn w-full text-[18px] md:text-[24px] mt-4">
          {translate('submitBtn')}
        </button>
      </form>
      <div id='recaptcha-container' style={{ display: 'none' }}></div>
    </div>
  )
}

export default OptModal