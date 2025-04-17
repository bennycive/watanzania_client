'use client'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
const StyleSixCard = dynamic(() => import('./StyleSixCard'), { ssr: false })
import StylesTitleDiv from '@/components/commonComponents/StylesTitleDiv';
import { getFeatureDataApi } from '@/utils/api/api';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { currentLanguageSelector } from '@/components/store/reducers/languageReducer';
import { settingsSelector } from '@/components/store/reducers/settingsReducer';
import AdSpace from '@/components/commonComponents/adSpace/AdSpace';
import dynamic from 'next/dynamic';
import { currentLangCode, getDirection } from '@/utils/helpers';

const StyleSix = ({ Data, setLoading }) => {

  const currLangCode = currentLangCode();

  const currentLanguage = useSelector(currentLanguageSelector)
  const settingsData = useSelector(settingsSelector)
  const storedLatitude = settingsData && settingsData?.lat
  const storedLongitude = settingsData && settingsData?.long
  const router = useRouter()

  const dataPerPage = 6;

  const [loadMore, setLoadMore] = useState(false)
  const [offset, setOffset] = useState(0)

  const [sliderData, setSliderData] = useState([])

  const [swiperNewsData, setSwiperNewsData] = useState([])
  const [totalData, setTotalData] = useState('')

  const [swiperVideoNewsData, setSwiperVideoNewsData] = useState([])
  const [swiperVideoNewType, setSwiperVideoNewType] = useState(null)
  const [totalVideoNewsData, setTotalVideoNewsData] = useState('')

  const [swiperBreakingNewsData, setSwiperBreakingNewsData] = useState([])
  const [totalBreakingNewsData, setTotalBreakingNewsData] = useState('')

  const Newbreakpoints = {
    320: {
      slidesPerView: 1.2
    },
    375: {
      slidesPerView: 1.5
    },
    576: {
      slidesPerView: 1.5
    },
    768: {
      slidesPerView: 2
    },
    992: {
      slidesPerView: 3
    },
    1200: {
      slidesPerView: 3
    },
    1400: {
      slidesPerView: 4
    }
  }

  const swiperOptionUpdate = {
    loop: false,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: false,
    breakpoints: Newbreakpoints,
    autoplay: {
      delay: 2000000,
      disableOnInteraction: false
    },
    onReachEnd: () => {
      if (totalData > dataPerPage && totalData !== swiperNewsData.length) {
        setLoadMore(true)
        setOffset(offset + 1)
      }
    }
    // pagination: { clickable: true },
  }

  const VideoNewsSwiperOptionUpdate = {
    loop: false,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: false,
    breakpoints: Newbreakpoints,
    autoplay: {
      delay: 2000000,
      disableOnInteraction: false
    },
    onReachEnd: () => {
      if (totalVideoNewsData > dataPerPage && totalVideoNewsData !== swiperVideoNewsData.length) {
        setLoadMore(true)
        setOffset(offset + 1)
      }
    }
    // pagination: { clickable: true },
  }

  const breakingNewsSwiperOptionUpdate = {
    loop: false,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 4,
    navigation: false,
    breakpoints: Newbreakpoints,
    autoplay: {
      delay: 2000000,
      disableOnInteraction: false
    },
    onReachEnd: () => {
      if (totalBreakingNewsData > dataPerPage && totalBreakingNewsData !== swiperBreakingNewsData.length) {
        setLoadMore(true)
        setOffset(offset + 1)
      }
    }
    // pagination: { clickable: true },
  }

  const fetchFeatureData = async () => {
    try {
      // !loadMore ? setLoading(true) : setLoading(false)
      const response = await getFeatureDataApi.getFeatureData({
        offset: offset * dataPerPage,
        limit: dataPerPage,
        section_id: Data?.id,
        language_id: currentLanguage?.id,
        latitude: storedLatitude,
        longitude: storedLongitude
      });
      setLoading(false)
      setSliderData(response?.data?.data)
      // console.log(response?.data?.data)
    } catch (error) {
      setSliderData([])
      console.error('Error:', error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (sliderData && sliderData[0]?.news?.length > 0) {
      loadMore ? setSwiperNewsData((prevData) => [...prevData, ...sliderData[0]?.news]) :
        setSwiperNewsData(sliderData[0]?.news);
    }
    if (sliderData && sliderData[0]?.videos?.length > 0) {
      loadMore ? setSwiperVideoNewsData((prevData) => [...prevData, ...sliderData[0]?.videos]) :
        setSwiperVideoNewsData(sliderData[0]?.videos);
      setSwiperVideoNewType(sliderData[0]?.videos_type)
    }
    if (sliderData && sliderData[0]?.breaking_news?.length > 0) {
      loadMore ? setSwiperBreakingNewsData((prevData) => [...prevData, ...sliderData[0]?.breaking_news]) :
        setSwiperBreakingNewsData(sliderData[0]?.breaking_news);
    }

    if (sliderData && sliderData[0]?.news) {
      setTotalData(sliderData[0]?.news_total)
    }
    if (sliderData && sliderData[0]?.breaking_news) {
      setTotalBreakingNewsData(sliderData[0]?.breaking_news_total)
    }
    if (sliderData && sliderData[0]?.videos) {
      setTotalVideoNewsData(sliderData[0]?.videos_total)
    }
  }, [sliderData])


  useEffect(() => {
    fetchFeatureData()

  }, [storedLatitude, storedLongitude, Data?.id, offset])

  useEffect(() => {

  }, [swiperNewsData, sliderData]);

  // console.log(Data);


  return (
    Data &&
    <>
      {/* ad spaces */}
      {Data.ad_spaces && Data.id == Data.ad_spaces.ad_featured_section_id ? (
        <div className='container'>
          <AdSpace ad_url={Data.ad_spaces.ad_url} ad_img={Data.ad_spaces.web_ad_image} style_web='six' />
        </div>
      ) : null}

      {/* video section start here  */}
      {swiperVideoNewsData?.length > 0 &&
        <div className="container styleSix">
          <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} styleSix={true} />
          <Swiper
            {...VideoNewsSwiperOptionUpdate}
            key={getDirection()}
            pagination={{
              clickable: false,
            }}
            className=""
          >

            {
              swiperVideoNewsData?.map((item, index) => (

                <SwiperSlide key={index}>
                  <StyleSixCard item={item} />
                </SwiperSlide>
              ))
            }
          </Swiper>

        </div>}
      {/* video section ends here  */}


      {/* news section start here  */}
      {swiperNewsData?.length > 0 &&
        <div className="container styleSix">
          <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} styleSix={true} />
          <Swiper
            {...swiperOptionUpdate}
            key={getDirection()}
            pagination={{
              clickable: false,
            }}
            className=""
          >

            {
              swiperNewsData?.map((item, index) => (

                <SwiperSlide key={index}>
                  <StyleSixCard item={item} newsSect={true} />
                </SwiperSlide>
              ))
            }
          </Swiper>

        </div>}
      {/* news section ends here  */}

      {/* breakingNews section start here  */}
      {swiperBreakingNewsData?.length > 0 &&
        <div className="container styleSix">
          <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} styleSix={true} />
          <Swiper
            {...breakingNewsSwiperOptionUpdate}
            key={getDirection()}
            pagination={{
              clickable: false,
            }}
            className=""
          >

            {
              swiperBreakingNewsData?.map((item, index) => (

                <SwiperSlide key={index}>
                  <StyleSixCard item={item} breakingNewsSect={true} />
                </SwiperSlide>
              ))
            }
          </Swiper>

        </div>}
      {/* breakingNews section ends here  */}

    </>
  )
}

export default StyleSix