'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';


// import required modules
import { FreeMode, Pagination } from 'swiper/modules';
import AdSpaceSkeleton from '@/components/skeletons/AdSpaceSkeleton';
import StyleTitleSkeleton from '@/components/skeletons/featureStyles/StyleTitleSkeleton';
import Skeleton from 'react-loading-skeleton';
import { getDirection } from '@/utils/helpers';

const StyleOneSkeleton = () => {

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
    <div className='styleOne'>
      <AdSpaceSkeleton />
      <div className="container">
        <StyleTitleSkeleton />
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
          {
            [...Array(3)].map((_, index) => (
              <SwiperSlide key={index} className='pb-16'>
                <div className='grid grid-cols-12 items-center justify-center container pt-6' >
                  <div className="content col-span-12 xl:col-span-7 flex flex-col gap-4 sm:gap-6 order-1 xl:order-none  skeletonBg justify-center p-4 sm:p-6 md:p-10  xl:p-12 h-full xl:h-[30rem] w-full xl:w-[55rem] rounded-b-[10px] xl:rounded-[10px] relative z-[1]">
                    <div>
                      <Skeleton height={40} className='my-2' width={80} />
                    </div>
                    <div>
                      <Skeleton height={40} className='my-2' width={120} />
                    </div>
                    <div>
                      <Skeleton height={40} className='my-2' width={200} />
                    </div>
                    <div>
                      <Skeleton height={40} className='my-2' width={100} />
                    </div>

                  </div>
                  <div className="img col-span-12 xl:col-span-5">
                    <Skeleton className='my-5 h-[18rem] md:h-[26rem] xl:h-[35rem] w-full' />
                  </div>
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>

    </div>
  )
}

export default StyleOneSkeleton