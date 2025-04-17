'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';


// import required modules
import { FreeMode, Pagination } from 'swiper/modules';
import StyleOneCard from './StyleOneCard'
import StylesTitleDiv from '@/components/commonComponents/StylesTitleDiv';
import AdSpace from '@/components/commonComponents/adSpace/AdSpace';
import { currentLangCode, getDirection } from '@/utils/helpers';

const StyleOne = ({ Data }) => {

  const currLangCode = currentLangCode();

  const swiperOption = {
    loop: false,
    speed: 750,
    spaceBetween: 10,
    slidesPerView: 1,
    navigation: false,
    autoplay: {
      delay: 2000000,
      disableOnInteraction: false
    },
    pagination: { clickable: true, }
  }


  return (
    <>
      {Data.ad_spaces && Data.id == Data.ad_spaces.ad_featured_section_id ? (
        <div className='container'>
          <AdSpace ad_url={Data.ad_spaces.ad_url} ad_img={Data.ad_spaces.web_ad_image} style_web={'one'} />
        </div>
      ) : null}

      {/* video section starts */}
      <>
        {
          Data?.videos && Data?.videos?.length > 0 &&
          <div className='styleOne'>
            <div className="">
              <Swiper
                key={getDirection()}
                freeMode={true}
                modules={[FreeMode, Pagination]}
                pagination={{
                  clickable: true,
                }}
                navigation
                {...swiperOption}
                className='custom-swiper'

              >
                {Data?.videos?.slice(0, 3).map((item, index) => (
                  <SwiperSlide key={index} className='pb-1 sm:pb-10 md:pb-14 lg:pb-16'>
                    <StyleOneCard item={item} videoSect={true} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        }
      </>
      {/* video section ends */}

      {/* news section starts */}
      <>
        {
          Data && Data.news?.length > 0 &&
          <div className='styleOne'>
            <div className="container">
              <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} />
            </div>
            <div className="">
              <Swiper
                key={getDirection()}
                freeMode={true}
                modules={[FreeMode, Pagination]}
                pagination={{
                  clickable: true,
                }}
                navigation
                {...swiperOption}
                className='custom-swiper'

              >
                {Data.news.slice(0, 3).map((item, index) => (
                  <SwiperSlide key={index} className='pb-1 sm:pb-10 md:pb-14 lg:pb-16'>
                    <StyleOneCard item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        }
      </>
      {/* news section ends */}


      {/* breaking-news section starts */}
      <>
        {
          Data && Data.breaking_news?.length > 0 &&
          <div className='styleOne'>
            <div className="">
              <Swiper
                key={getDirection()}
                freeMode={true}
                modules={[FreeMode, Pagination]}
                pagination={{
                  clickable: true,
                }}
                navigation
                {...swiperOption}
                className='custom-swiper'

              >
                {Data.breaking_news.slice(0, 3).map((item, index) => (
                  <SwiperSlide key={index} className='pb-1 sm:pb-10 md:pb-14 lg:pb-16'>
                    <StyleOneCard item={item} breakingNewsSect={true} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        }
      </>
      {/* breaking-news section ends */}

    </>
  )
}

export default StyleOne