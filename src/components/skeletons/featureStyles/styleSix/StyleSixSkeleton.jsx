'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import StyleTitleSkeleton from '@/components/skeletons/featureStyles/StyleTitleSkeleton';
import StyleSixSkeletonCard from './StyleSixSkeletonCard';
import { getDirection } from '@/utils/helpers';

const StyleSixSkeleton = () => {

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
    spaceBetween: 10,
    slidesPerView: 4,
    navigation: false,
    breakpoints: Newbreakpoints,
    autoplay: {
      delay: 2000000,
      disableOnInteraction: false
    },
    // onReachEnd: () => {
    //   if (totalData > dataPerPage && totalData !== swiperNewsData.length) {
    //     setLoadMore(true)
    //     setOffset(offset + 1)
    //   }
    // }
    // pagination: { clickable: true },
  }

  return (
    <div className='styleSix'>
      <div className="container">
        <StyleTitleSkeleton />
        <Swiper
          {...swiperOptionUpdate}
          key={getDirection()}
          pagination={{
            clickable: false,
          }}
          className="tech-swiper !pt-6 !md:pt-20 !pt pb-2"
        >
          {
            [...Array(6)].map((_, index) => (
              <SwiperSlide key={index}>
                <StyleSixSkeletonCard />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
    </div>
  )
}

export default StyleSixSkeleton