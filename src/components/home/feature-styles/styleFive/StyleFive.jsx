'use client'
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';


// import required modules
import Image from 'next/image';
import earthImg from '../../../../assets/Images/earthImage.png'
import StyleFiveCard from './StyleFiveCard';
import { useRef } from 'react';
import { useCallback } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import AdSpace from '@/components/commonComponents/adSpace/AdSpace';
import Link from 'next/link';
import { currentLangCode, getDirection, placeholderImage, translate } from '@/utils/helpers';
import { useSelector } from 'react-redux';
import { currentLanguageSelector } from '@/components/store/reducers/languageReducer';


const StyleFive = ({ Data }) => {

  const currLangCode = currentLangCode();

  const currentLanguage = useSelector(currentLanguageSelector);

  const showNavigation = Data.news?.length > 1

  const showNavigationBreaking = Data.breaking_news?.length > 1

  const showNavigationVideo = Data.videos?.length > 1

  const swiperOption = {
    loop: true,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 2,
    navigation: showNavigation,
    breakpoints: {
      0: {
        slidesPerView: 1
      },

      768: {
        slidesPerView: 2
      },

      992: {
        slidesPerView: 2
      },
      1200: {
        slidesPerView: 3
      }
    },
    autoplay: true
  }

  const swiperOptionVideo = {
    loop: true,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 2,
    navigation: showNavigationVideo,
    breakpoints: {
      0: {
        slidesPerView: 1
      },

      768: {
        slidesPerView: 2
      },

      992: {
        slidesPerView: 2
      },
      1200: {
        slidesPerView: 3
      }
    },
    autoplay: true
  }

  const swiperOptionBreaking = {
    loop: true,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 2,
    navigation: showNavigationBreaking,
    breakpoints: {
      0: {
        slidesPerView: 1
      },

      768: {
        slidesPerView: 2
      },

      992: {
        slidesPerView: 2
      },
      1200: {
        slidesPerView: 3
      }
    },
    autoplay: true
  }

  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;

    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);


  return (
    Data &&
    <>
      {/* ad spaces */}
      {Data.ad_spaces && Data.id == Data.ad_spaces.ad_featured_section_id ? (
        <div className='container'>
          <AdSpace ad_url={Data.ad_spaces.ad_url} ad_img={Data.ad_spaces.web_ad_image} style_web={'five'} />
        </div>
      ) : null}

      {/* videoNewsSect starts from here  */}
      {
        Data.videos && Data.videos?.length > 0 &&
        <div className="relative styleFiveSwiper commonBg overflow-hidden">
          <div className='container p-4'>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center py-12">

              <div className="md:col-span-2 bg-gray-900 text-white p-6 rounded-[16px] relative overflow-hidden h-full flexCenter">
                <Image src={earthImg} alt="Earth" className="absolute inset-0 w-full h-full object-cover opacity-50" onError={placeholderImage} loading='lazy' />
                <div className="relative z-10 md:ml-2 xl:ml-14">
                  <h6 className="text-[30px] sm:text-[40px] font-bold mb-4">{Data?.title}</h6>
                  <Link
                    href={{ pathname: `/${currLangCode}/view-all/${Data?.slug}`, query: { language_id: currentLanguage?.id } }}
                    title={translate('viewall')}
                    className="commonBtn text-[18px] sm:text-[24px]">
                    {translate('viewall')}
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4 ">
                <Swiper
                  ref={sliderRef}
                  key={getDirection()}
                  {...swiperOptionVideo}
                  pagination={{
                    clickable: false,
                  }}
                  autoplay={{ delay: 3000 }}
                  modules={[Autoplay]}
                  className="tech-swiper !pt-20 !pb-2"
                >
                  {
                    Data?.videos?.map((element, index) => (
                      <SwiperSlide key={index}>
                        <StyleFiveCard element={element} videoNewsCard={true} />
                      </SwiperSlide>
                    ))
                  }
                </Swiper>
              </div>
            </div>

            {
              Data && Data.videos?.length > 3 &&
              <div className="navigations flexCenter lg:w-[135%] gap-4 pb-8">

                <div className="swiper-button-prev !px-2 !rounded-lg commonBtn" onClick={handlePrev} >
                  <span><FaAngleLeft color='white' className='rtl:rotate-180' size={28} /></span>
                </div>
                <div className="swiper-button-next !px-2 !rounded-lg commonBtn" onClick={handleNext}>
                  <span><FaAngleRight color='white' className='rtl:rotate-180' size={28} /></span>
                </div>

              </div>
            }
          </div>
        </div>

      }
      {/* videoNewsSect ends here  */}


      {/* newsSect starts from here  */}
      {
        Data && Data.news?.length &&
        <div className="relative styleFiveSwiper commonBg overflow-hidden">
          <div className='container p-4'>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center py-12">

              <div className="md:col-span-2 bg-gray-900 text-white p-6 rounded-[16px] relative overflow-hidden h-full flexCenter">
                <Image src={earthImg} alt="Earth" className="absolute inset-0 w-full h-full object-cover opacity-50" onError={placeholderImage} loading='lazy'/>
                <div className="relative z-10 md:ml-2 xl:ml-14">
                  <h2 className="text-[30px] sm:text-[40px] font-bold mb-4">{Data?.title}</h2>
                  <Link
                    href={{ pathname: `/${currLangCode}/view-all/${Data?.slug}`, query: { language_id: currentLanguage?.id } }}
                    title={translate('viewall')}
                    className="commonBtn text-[18px] sm:text-[24px]">
                    {translate('viewall')}
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4 ">
                <Swiper
                  ref={sliderRef}
                  key={getDirection()}
                  {...swiperOption}
                  pagination={{
                    clickable: false,
                  }}
                  autoplay={{ delay: 3000 }}
                  modules={[Autoplay]}
                  className="tech-swiper !pt-20 !pb-2"
                >
                  {
                    Data?.news?.map((element, index) => (
                      <SwiperSlide key={index}>
                        <StyleFiveCard element={element} />
                      </SwiperSlide>
                    ))
                  }
                </Swiper>
              </div>
            </div>
            {
              Data && Data.news?.length > 3 &&
              <div className="navigations flexCenter lg:w-[135%] gap-4 pb-8">

                <div className="swiper-button-prev !px-2 !rounded-lg commonBtn" onClick={handlePrev} >
                  <span><FaAngleLeft color='white' className='rtl:rotate-180' size={28} /></span>
                </div>
                <div className="swiper-button-next !px-2 !rounded-lg commonBtn" onClick={handleNext}>
                  <span><FaAngleRight color='white' className='rtl:rotate-180' size={28} /></span>
                </div>

              </div>
            }
          </div>
        </div>
      }
      {/* newsSect ends here  */}


      {/* breakingNewsSect starts from here  */}
      {
        Data && Data.breaking_news?.length &&
        <div className="relative styleFiveSwiper commonBg overflow-hidden"> 
          <div className='container p-4'>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center py-12">

              <div className="md:col-span-2 bg-gray-900 text-white p-6 rounded-[16px] relative overflow-hidden h-full flexCenter">
                <Image src={earthImg} alt="Earth" loading='lazy' className="absolute inset-0 w-full h-full object-cover opacity-50" onError={placeholderImage}/>
                <div className="relative z-10 md:ml-2 xl:ml-14">
                  <h2 className="text-[30px] sm:text-[40px] font-bold mb-4">{Data?.title}</h2>
                  <Link
                    href={{ pathname: `/${currLangCode}/view-all/${Data?.slug}`, query: { language_id: currentLanguage?.id } }}
                    title={translate('viewall')}
                    className="commonBtn text-[18px] sm:text-[24px]">
                    {translate('viewall')}
                  </Link>
                </div>
              </div>

              <div className="md:col-span-4 ">
                <Swiper
                  ref={sliderRef}
                  key={getDirection()}
                  {...swiperOptionBreaking}
                  pagination={{
                    clickable: false,
                  }}
                  autoplay={{ delay: 3000 }}
                  modules={[Autoplay]}
                  className="tech-swiper !pt-20 !pb-2"
                >
                  {
                    Data?.breaking_news?.map((element, index) => (
                      <SwiperSlide key={index}>
                        <StyleFiveCard element={element} breakingNewsCard={true} />
                      </SwiperSlide>
                    ))
                  }
                </Swiper>
              </div>
            </div>
            {
              Data && Data.breaking_news?.length > 3 &&
              <div className="navigations flexCenter lg:w-[135%] gap-4 pb-8">

                <div className="swiper-button-prev !px-2 !rounded-lg commonBtn" onClick={handlePrev} >
                  <span><FaAngleLeft color='white' className='rtl:rotate-180' size={28} /></span>
                </div>
                <div className="swiper-button-next !px-2 !rounded-lg commonBtn" onClick={handleNext}>
                  <span><FaAngleRight color='white' className='rtl:rotate-180' size={28} /></span>
                </div>

              </div>
            }
          </div>
        </div>
      }
      {/* breakingNewsSect ends here  */}


    </>
  );
};

export default StyleFive;