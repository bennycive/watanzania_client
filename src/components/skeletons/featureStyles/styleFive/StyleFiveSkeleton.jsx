'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';


// import required modules
import { useRef } from 'react';
import { useCallback } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import StyleFiveSkeletonOne from '@/components/skeletons/featureStyles/styleFive/StyleFiveSkeletonOne';
import StyleFiveSkeletonTwo from '@/components/skeletons/featureStyles/styleFive/StylefiveSkeletonTwo';
import { getDirection } from '@/utils/helpers';


const StyleFiveSkeleton = () => {

    const swiperOptionVideo = {
        loop: true,
        speed: 750,
        spaceBetween: 10,
        slidesPerView: 2,
        navigation: false,
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
        <div className={`styleFive commonBg overflow-hidden relative`}>

            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center py-12">
                    <StyleFiveSkeletonOne />
                    <div className="md:col-span-4 ">
                        <Swiper
                            key={getDirection()}
                            ref={sliderRef}
                            {...swiperOptionVideo}
                            pagination={{
                                clickable: false,
                            }}
                            autoplay={{ delay: 3000 }}
                            modules={[Autoplay]}
                            className="tech-swiper !pt-20 !pb-2"
                        >
                            {
                                [...Array(6)].map((_, index) => (
                                    <SwiperSlide key={index}>
                                        <StyleFiveSkeletonTwo />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>
                <div className="navigations flexCenter lg:w-[135%] gap-4 pb-8">

                    <div className="swiper-button-prev !px-2 !rounded-lg commonBtn" onClick={handlePrev} >
                        <span><FaAngleLeft color='white' size={28} className='rtl:rotate-180' /></span>
                    </div>
                    <div className="swiper-button-next !px-2 !rounded-lg commonBtn" onClick={handleNext}>
                        <span><FaAngleRight color='white' size={28} className='rtl:rotate-180' /></span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StyleFiveSkeleton;