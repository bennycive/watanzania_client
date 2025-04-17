'use client'
import React, { useState, useEffect } from 'react'
import { SlCalender } from 'react-icons/sl'
import { HiArrowLongUp, HiArrowLongDown } from 'react-icons/hi2'
const SocialMedias = dynamic(() => import('./SocialMedias'), { ssr: false })
import ThemeToggler from './ThemeToggler';
const LanguageDropdown = dynamic(() => import('../dropdowns/LanguageDropdown'), { ssr: false })
import dynamic from 'next/dynamic';
import { registertokenApi } from '@/utils/api/api';
import { currentLanguageSelector } from '../store/reducers/languageReducer';
import { useDispatch, useSelector } from 'react-redux';
import { loadLocation, settingsSelector } from '../store/reducers/settingsReducer';
import { isLogin, translate } from '@/utils/helpers';
import { checkLocationPermissionGranted, checkPermissionsSelector, isLocationPermissionCheck, isNotificationPermissionCheck } from '../store/reducers/CheckPermissionsReducer';
import axios from 'axios';
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { TiWeatherPartlySunny } from "react-icons/ti";
import Skeleton from 'react-loading-skeleton'

const TopBar = () => {

  const [loading, setLoading] = useState(false)
  const [weather, setWeather] = useState([])

  const router = useRouter();
  const dispatch = useDispatch()

  const settingsData = useSelector(settingsSelector);

  const checkPermissions = useSelector(checkPermissionsSelector);
  const checkNotificationPermissionOnce = checkPermissions?.data?.isNotificaitonPermissionCheck;
  const checkLocationPermissonOnce = checkPermissions?.data?.isLocaitonPermissionCheck;

  const locationWiseNews = settingsData?.data?.location_news_mode;
  const weatherMode = settingsData?.data?.weather_mode;

  const currentLanguage = useSelector(currentLanguageSelector);

  const weatherApi = async () => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords

            if (locationWiseNews === '1') {
              loadLocation(latitude, longitude)
            } else {
              loadLocation(null, null)
            }

            const response = await axios.get(
              `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no&lang=${currentLanguage?.code}`
            )
            setWeather(response?.data)
            checkLocationPermissionGranted({ data: { isLocationPermission: 'granted' } })
            resolve(response.data) // Resolve the promise with the fetched data
            setLoading(false)
          })
        } else {
          toast.error('Geolocation not supported')
          checkLocationPermissionGranted({ data: { isLocationPermission: 'not supported' } })
        }
      } catch (error) {
        loadLocation(null, null)
        reject(error) // Reject the promise if an error occurs
      }
    })
  }

  useEffect(() => {
    weatherApi()
  }, [currentLanguage, locationWiseNews])


  useEffect(() => {
  }, [weather, currentLanguage])



  // to get today weekday nameselectLanguages
  const today = new Date()

  const dayOfMonth = today.getDate() // returns the day of the month (1-31)
  // const month = today.getMonth() + 1;  // returns the month (0-11); add 1 to get the correct month
  const year = today.getFullYear() // returns the year (4 digits)

  const month = today.toLocaleString('default', { month: 'long' })

  // Assuming forecastData is an array of forecast objects

  const maxTempC = weather && weather?.forecast?.forecastday[0]?.day?.maxtemp_c;
  const minTempC = weather && weather?.forecast?.forecastday[0]?.day?.mintemp_c;

  const storedLatitude = settingsData?.lat;
  const storedLongitude = settingsData?.long;


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


  useEffect(() => {
    if (checkPermissions?.data?.isNotificaitonPermission === 'granted' && isLogin() && checkNotificationPermissionOnce === false) {
      registerToken(settingsData?.fcmtoken)
      dispatch(isNotificationPermissionCheck({ data: { isNotificaitonPermissionChecked: true } }))
    }
    if (checkPermissions?.data?.isNotificaitonPermission === 'denied' && isLogin() && checkNotificationPermissionOnce === false) {
      registerToken('')
      dispatch(isNotificationPermissionCheck({ data: { isNotificaitonPermissionChecked: true } }))
    }
    if (checkPermissions?.data?.isLocationPermission === 'granted' && isLogin() && checkLocationPermissonOnce === false) {
      registerToken('')
      dispatch(isLocationPermissionCheck({ data: { isLocaitonPermissionChecked: true } }))
    }
  }, [isLogin(), checkPermissions]);

  return (

    <div className='secondaryBg py-[10px]'>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2">

          <div className="leftDiv flex items-center gap-2 xl:gap-4 flex-wrap">
            <div className='date flex items-center gap-2 text-white text-[13px] font-[700] commonRadius primaryBg w-max py-1 px-2'>
              <span><SlCalender /></span>
              <span> {`${month}`}
                {`${dayOfMonth}`}
                ,{`${year}`}</span>
            </div>
            {
              loading ? <Skeleton height={5} /> :
                weather && weatherMode === '1' &&
                <div className="weather flex items-center gap-3">
                  <div>
                    <div className='flex items-center gap-2'>
                      <span className='me-2 weatherIcon primaryColor'><TiWeatherPartlySunny size={32} /></span>
                      <span className='text-white font-[700] text-lg'> {weather && weather?.current?.temp_c}°C </span>
                    </div>
                  </div>
                  <div className='flex flex-col text-white text-[13px]'>
                    <span className=' font-[700]'>  {weather && weather?.location && weather?.location?.name},
                      {weather && weather?.location && weather?.location?.region},
                      {weather && weather?.location && weather?.location?.country}</span>
                    <div className='flex items-center justify-center gap-2'>
                      <div className='flex items-center'>
                        <span><HiArrowLongUp /></span>
                        <span>{maxTempC}°C </span>
                      </div>
                      <div className='flex items-center '>
                        <span><HiArrowLongDown /></span>
                        <span>{minTempC}°C</span>
                      </div>
                    </div>
                  </div>
                </div>
            }
          </div>

          <div className="rightDiv xl:flex items-center justify-end gap-4 hidden">
            <ThemeToggler />
            {
              router.asPath === '/' && settingsData ?
                <>
                  <LanguageDropdown />
                </>
                :
                <span className='text-white font-[600]'>{translate('followus')} :</span>
            }
            <SocialMedias />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar