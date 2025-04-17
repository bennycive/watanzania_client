'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
const StyleOne = dynamic(() => import('./feature-styles/styleOne/StyleOne'), { ssr: false })
const StyleTwo = dynamic(() => import('./feature-styles/styleTwo/StyleTwo'), { ssr: false })
const StyleThree = dynamic(() => import('./feature-styles/styleThree/StyleThree.jsx'), { ssr: false })
const StyleFour = dynamic(() => import('./feature-styles/styleFour/StyleFour'), { ssr: false })
const StyleFive = dynamic(() => import('./feature-styles/styleFive/StyleFive'), { ssr: false })
const StyleSix = dynamic(() => import('./feature-styles/styleSix/StyleSix'), { ssr: false })
const DefaultStyle = dynamic(() => import('./feature-styles/defaultStle/DefaultStyle'), { ssr: false })
import { getFeatureDataApi, getNewsApi } from '@/utils/api/api'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { NoDataFound, translate } from '@/utils/helpers'
import StyleOneSkeleton from '../skeletons/featureStyles/styleOne/StyleOneSkeleton.jsx'
import StyleTwoSkeleton from '../skeletons/featureStyles/styleTwo/StyleTwoSkeleton'
import StyleSixSkeleton from '../skeletons/featureStyles/styleSix/StyleSixSkeleton'
import StyleThreeSkeletonSkeleton from '../skeletons/featureStyles/styleThree/StyleThreeSkeleton'
import StyleFourSkeleton from '../skeletons/featureStyles/styleFour/StyleFourSkeleton'
import StyleFiveSkeleton from '../skeletons/featureStyles/styleFive/StyleFiveSkeleton'
import { settingsSelector } from '../store/reducers/settingsReducer'
import Layout from '../layout/Layout'

const HomePage = () => {

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  const [noFeatureData, setNoFeatureData] = useState(false)
  const [newsDataFound, setNewsDataFound] = useState(true)
  const [isNoDataLoading, setNoDataIsLoading] = useState(false)
  const [defaultData, setDefaultData] = useState([])


  const currentLanguage = useSelector(currentLanguageSelector)

  const settingsData = useSelector(settingsSelector)

  const userToken = null;

  const fetchFeatureData = async () => {
    try {
      setLoading(true)
      const response = await getFeatureDataApi.getFeatureData({
        offset: 0,
        limit: 9,
        isToken: userToken ? true : false,
        language_id: currentLanguage?.id,
      });
      const data = response.data?.data;
      setData(data)
      setLoading(false)
      setNewsDataFound(false)

      if (response.data.error) {
        setNoDataIsLoading(true)
      }

    } catch (error) {
      console.error('Error:', error);
      setData([])
      setNoFeatureData(false)
      setNewsDataFound(true)
      setLoading(false)
      setNoDataIsLoading(true)
    } finally {
      setLoading(false)
    }
  };

  const getNewsWhenNoData = async () => {
    try {
      setLoading(true)
      const response = await getNewsApi.getNews({
        offset: '0',
        limit: 10, // {optional}
        language_id: currentLanguage?.id,
        latitude: settingsData?.lat,
        longitude: settingsData?.long,
      });
      setDefaultData(response?.data?.data)
      setNewsDataFound(false)
      setNoDataIsLoading(false)
      setLoading(false)

      if (response.data.error) {
        setNewsDataFound(true)
      }

    } catch (error) {
      console.error('Error:', error);
      setNewsDataFound(true)
      setNoDataIsLoading(false)
      setLoading(false)
      setNoFeatureData(true)
      setNewsDataFound(true)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (currentLanguage?.id)
      fetchFeatureData()
  }, [currentLanguage])

  useEffect(() => {
    if (isNoDataLoading) {
      getNewsWhenNoData()
    }
  }, [isNoDataLoading])

  useEffect(() => {

  }, [defaultData, data])

  const SelectType = () => {
    return (
      noFeatureData && newsDataFound ? <>
        {NoDataFound()}
      </> :
        data &&
        data.map((item, index) => {
          // console.log('i am feature sectoin')
          if (item.news_type === 'news') {
            if (item.style_web === 'style_1') {
              return <StyleOne key={index} Data={item} />
            } else if (item.style_web === 'style_2') {
              return <StyleTwo key={index} Data={item} />
            } else if (item.style_web === 'style_3') {
              return <StyleThree key={index} Data={item} />
            } else if (item.style_web === 'style_4') {
              return <StyleFour key={index} Data={item} />
            } else if (item.style_web === 'style_5') {
              return <StyleFive key={index} Data={item} />
            } else if (item.style_web === 'style_6') {
              return <StyleSix key={index} Data={item} loading={loading} setLoading={setLoading} />
            }
          } else if (item.news_type === 'breaking_news') {
            if (item.style_web === 'style_1') {
              return <StyleOne key={index} Data={item} />
            } else if (item.style_web === 'style_2') {
              return <StyleTwo key={index} Data={item} />
            } else if (item.style_web === 'style_3') {
              return <StyleThree key={index} Data={item} />
            } else if (item.style_web === 'style_4') {
              return <StyleFour key={index} Data={item} />
            } else if (item.style_web === 'style_5') {
              return <StyleFive key={index} Data={item} />
            } else if (item.style_web === 'style_6') {
              return <StyleSix key={index} Data={item} loading={loading} setLoading={setLoading} />
            }
          } else if (item.news_type === 'videos') {
            if (item.style_web === 'style_1') {
              return <StyleOne key={index} Data={item} />
            } else if (item.style_web === 'style_2') {
              return <StyleTwo key={index} Data={item} />
            } else if (item.style_web === 'style_3') {
              return <StyleThree key={index} Data={item} />
            } else if (item.style_web === 'style_4') {
              return <StyleFour key={index} Data={item} />
            } else if (item.style_web === 'style_5') {
              return <StyleFive key={index} Data={item} />
            } else if (item.style_web === 'style_6') {
              return <StyleSix key={index} Data={item} loading={loading} setLoading={setLoading} />
            }
          } else if (item.news_type === 'user_choice') {
            if (item.style_web === 'style_1') {
              return <StyleOne key={index} Data={item} />
            } else if (item.style_web === 'style_2') {
              return <StyleTwo key={index} Data={item} />
            } else if (item.style_web === 'style_3') {
              return <StyleThree key={index} Data={item} />
            } else if (item.style_web === 'style_4') {
              return <StyleFour key={index} Data={item} />
            } else if (item.style_web === 'style_5') {
              return <StyleFive key={index} Data={item} />
            } else if (item.style_web === 'style_6') {
              return <StyleSix key={index} Data={item} loading={loading} setLoading={setLoading} />
            }
          }
          return null
        })
    )
  }

  const selectedComponent = SelectType()
  
  return (
    <Layout>
      <div className='flex flex-col gap-10 md:gap-12 lg:gap-14 mb-4 homePage commonMT'>
        {loading ? (
          <>
            <StyleOneSkeleton />
            <StyleTwoSkeleton />
            <StyleThreeSkeletonSkeleton />
            <StyleFourSkeleton />
            <StyleFiveSkeleton />
            <StyleSixSkeleton />

          </>
        ) : selectedComponent && selectedComponent.length > 0 ? (
          selectedComponent
        ) : !newsDataFound ? <> <DefaultStyle isLoading={isNoDataLoading} Data={defaultData} /> </> :
          (
            <p className='h-[64vh] flexCenter textPrimary font-[600] text-2xl'>{translate('noNews')}</p>
          )
        }
      </div>
    </Layout>
  )
}

export default HomePage