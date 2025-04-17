'use client'
import React, { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import { useRouter } from 'next/router'
import AdSpace from '../commonComponents/adSpace/AdSpace'
import { FiCalendar } from 'react-icons/fi';
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs';
import { AiOutlineLike, AiOutlineEye, AiFillLike } from 'react-icons/ai';
import { LuClock3 } from "react-icons/lu";
import Image from 'next/image'
import { Slider } from "@/components/ui/slider"
import RelatedNewSections from '../relatedNews/RelatedNewSections'
import TagSection from '../tag/TagSection'
import SurveysSection from '../surveys/SurveysSection'
import CommentSection from '../comments/CommentSection'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { getBreaingNewsApi, getNewsApi, getNewsDetailsAdSpacesApi, setBookmarkApi, setBreakingNewsViewApi, setLikeDisLikeApi, setNewsViewApi } from '@/utils/api/api'
import { calculateReadTime, currentLangCode, extractTextFromHTML, isLogin, NoDataFound, placeholderImage, translate } from '@/utils/helpers'
import VideoPlayerModal from '../commonComponents/videoplayer/VideoPlayerModal'
import { GoTag } from 'react-icons/go';
import toast from 'react-hot-toast'
import { userDataSelector } from '../store/reducers/userReducer'
import SeoShare from '../SocialMediaShares/SeoShare'
import WithoutSeoShare from '../SocialMediaShares/WithoutSeoShare'
import DetailPageSkeleton from '../skeletons/DetailPageSkeleton'
import OpenInAppPopUp from '../commonComponents/OpenInAppPopUp'
import LightBox from '../commonComponents/lightBox/LightBox'
import { FaImages } from 'react-icons/fa6'
import { setLoginModalState } from '../store/reducers/helperReducer'


const NewsDetails = ({ breakingNews }) => {

  const currLangCode = currentLangCode();
  const [fontSize, setFontSize] = useState(18) // Set initial font size to 14px

  const router = useRouter();
  const slug = router?.query?.slug;
  const isShare = router?.query?.share;

  const cateSlug = router?.query?.cateSlug;
  const subCateSlug = router?.query?.subCateSlug;

  console.log(router)

  const settingsData = useSelector(settingsSelector)
  const currentLanguage = useSelector(currentLanguageSelector)

  const [like, setLike] = useState(false);

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [bookmark, setBookmark] = useState(false)

  const [newsViewsIncreament, setNewsViewsIncreament] = useState(false)
  const [breakingNewsViewsIncreament, setBreakingNewsViewsIncreament] = useState(false)

  const [adSpacesData, setAdSpacesData] = useState([]);

  const [IsOpenInApp, setIsOpenInApp] = useState(false);

  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const openLightbox = index => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  };

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  useEffect(() => {
    if (isShare && window.innerWidth <= 768) {
      setIsOpenInApp(true)
    }
    else {
      setIsOpenInApp(false)
    }
  }, [window.innerWidth, isShare])

  const userData = useSelector(userDataSelector)

  const currentUrL = `${process.env.NEXT_PUBLIC_WEB_URL}${router?.asPath}&share=true`;

  const decodedURL = decodeURI(currentUrL);

  const galleryPhotos = data && data?.data;


  let userName = ''

  const checkUserData = userData => {
    if (userData?.data && userData?.data?.name !== '') {
      return (userName = userData?.data?.name)
    } else if (userData?.data && userData?.data?.email !== '') {
      return (userName = userData?.data?.email)
    } else if (userData?.data && (userData?.data?.mobile !== null || userData?.data?.mobile !== '')) {
      return (userName = userData?.data?.mobile)
    }
  }

  const getNewsDetails = async () => {
    try {
      setLoading(true)
      const { data } = await getNewsApi.getNews({
        slug: subCateSlug ? subCateSlug : cateSlug ? cateSlug : slug,
        language_id: currentLanguage?.id
      });

      if (!data?.error) {
        if (data?.data?.[0]?.bookmark == 0) {
          setBookmark(false);
        } else {
          setBookmark(true);
        }

        if (data?.data?.[0]?.like === 0) {
          setLike(false);
        } else {
          setLike(true);
        }

        setData(data)
        setLoading(false)
      }
      else {
        console.log('error =>', data?.message)
        setData([])
        setLoading(false)
      }

    } catch (error) {
      console.error('Error:', error);
      setData([])
    } finally {
      setLoading(false)
    }
  };

  const getBreakingNewsDetails = async () => {
    try {
      setLoading(true)
      const { data } = await getBreaingNewsApi.getBreakingNews({
        slug: slug,
        language_id: currentLanguage?.id
      });

      if (!data?.error) {
        setData(data)
        setLoading(false)
      }
      else {
        console.log('error =>', data?.message)
        setData([])
        setLoading(false)
      }

    } catch (error) {
      console.error('Error:', error);
      if (error === 'No Data Found') {
        router.push('/');
      }
      setData([])
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (currentLanguage?.id && !breakingNews) {
      getNewsDetails()
    }
    if (currentLanguage?.id && breakingNews) {
      getBreakingNewsDetails()
    }
  }, [currentLanguage, slug])

  const text = extractTextFromHTML(data && data?.data?.description);

  const readTime = calculateReadTime(text);


  // adSpaces 

  const getAdspaces = async () => {
    try {
      const { data } = await getNewsDetailsAdSpacesApi.getNewsDetailsAdSpaces({
        language_id: currentLanguage?.id
      });
      if (!data?.error) {
        setAdSpacesData(data?.data)
      }
      else {
        console.log('adSpace-error =>', data?.message)
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (currentLanguage?.id) {
      getAdspaces()
    }
  }, [currentLanguage])


  // News View api
  const setNewsView = async () => {
    if (isLogin() && data && !newsViewsIncreament) {
      try {
        const response = await setNewsViewApi.setNewsView({
          news_id: data?.data[0]?.id
        });

        if (!response?.data?.error) {
          setNewsViewsIncreament(true)
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false)
      }
    }
  };

  // breakingNews View api
  const setBreakingNewsView = async () => {
    if (isLogin() && data && !breakingNewsViewsIncreament) {
      try {
        const response = await setBreakingNewsViewApi.setBreakingNewsView({
          breaking_news_id: data?.data[0]?.id
        });

        if (!response?.data?.error) {
          setBreakingNewsViewsIncreament(true)
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false)
      }
    }
  };

  useEffect(() => {
    if (breakingNews) {
      setBreakingNewsView()
    } else {
      setNewsView()
    }
  }, [data])


  const handleBookamrkNews = () => {
    if (isLogin()) {
      setBookmarkNews(data && data?.data?.[0]?.id)
    }
    else {
      setLoginModalState({ openModal: true })
      toast.error(translate('loginFirst'))
      setTimeout(() => {
        setLoginModalState({ openModal: false })
      }, 2000);
    }
  }
  const handleLikeNews = () => {
    if (isLogin()) {
      setLikeDislikeData(data && data?.data?.[0]?.id)
    }
    else {
      setLoginModalState({ openModal: true })
      toast.error(translate('loginFirst'))
      setTimeout(() => {
        setLoginModalState({ openModal: false })
      }, 2000);
    }
  }


  const setBookmarkNews = async (id) => {
    try {
      const { data } = await setBookmarkApi.setBookmark({
        news_id: id,
        status: bookmark ? 0 : 1,
      });

      if (!data?.error) {
        // getNewsDetails()
        setBookmark(!bookmark)
        toast.success(data?.message);
      }
      else {
        console.log('bookmark error =>', data?.message)
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
    }
  };

  const setLikeDislikeData = async (id) => {
    try {
      const { data } = await setLikeDisLikeApi.setLikeDisLike({
        news_id: id,
        status: like ? 0 : 1,
      });

      if (!data?.error) {
        // getNewsDetails()
        setLike(!like)
      }
      else {
        console.log('like error =>', data?.message)
      }
      // toast.success(response?.data?.message);

    } catch (error) {
      console.error('Error:', error);
    } finally {
    }
  };

  return (
    <Layout>
      <section className='detailPage'>
        {
          loading ?
            <DetailPageSkeleton />
            :
            data && data?.data?.length > 0 ?
              <>
                {
                  cateSlug ?
                    <Breadcrumb secondElement={translate('catLbl')} thirdElement={slug} fourthElement={cateSlug} categorySlug={slug} />
                    :
                    subCateSlug ?
                      <Breadcrumb secondElement={translate('catLbl')} thirdElement={translate('subcatLbl')} fourthElement={slug} fifthElement={subCateSlug}  subCateSlug={slug} />
                      :
                      <Breadcrumb secondElement={translate('newsDetails')} thirdElement={data && data?.data[0]?.title} />
                }
                {/* ad spaces */}
                {adSpacesData && adSpacesData?.ad_spaces_top ? (
                  <div className='container  mt-8 md:mt-12'>
                    <AdSpace ad_url={adSpacesData && adSpacesData?.ad_spaces_top.ad_url} ad_img={adSpacesData && adSpacesData?.ad_spaces_top.web_ad_image} style_web='' />
                  </div>
                ) : null}
                <section className='container detailPage commonMT'>
                  <div className="grid grid-cols-12 gap-y-10 lg:gap-8">
                    <div className="col-span-12 lg:col-span-8">
                      <div className='flex flex-col gap-8'>
                        <div>
                          {
                            breakingNews ?
                              <span className='categoryTag'>{translate('breakingnews')}</span> :
                              <span className='categoryTag'>{data && data?.data[0]?.category?.category_name}</span>
                          }
                          <h2 className='text-[22px] md:text-[34px] lg:text-[46px] font-[700] capitalize textPrimary mt-2'>
                            {data && data?.data[0]?.title}
                          </h2>
                        </div>

                        <div className='flex items-center justify-between flex-wrap gap-6 border-y borderColor py-4 sm:py-6'>
                          <div className='flex items-center gap-4 sm:gap-8 flex-wrap'>
                            {
                              !breakingNews &&
                              <>
                                <div className='flex items-center gap-1 textPrimary font-[600]'>
                                  <FiCalendar size={18} />
                                  <span>{new Date(data && data?.data[0]?.published_date).toLocaleString('en-us', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}</span>
                                </div>
                                <div className='flex items-center gap-1 textPrimary font-[600]'>
                                  <AiOutlineLike size={18} />
                                  <span>{data && data?.data[0]?.total_like} {translate('likes')}</span>
                                </div>
                              </>
                            }


                            <div className='flex items-center gap-1 textPrimary font-[600]'>
                              <AiOutlineEye size={18} />
                              <span>{newsViewsIncreament ? data && data?.data[0]?.total_views + 1 : data && data?.data[0]?.total_views}</span>
                            </div>

                            <div className='flex items-center gap-1 textPrimary font-[600]'>
                              <LuClock3 />
                              <span> {readTime && readTime > 1
                                ? ' ' + readTime + ' ' + translate('minutes') + ' ' + translate('read')
                                : ' ' + readTime + ' ' + translate('minute') + ' ' + translate('read')}</span>
                            </div>
                          </div>

                          {process.env.NEXT_PUBLIC_SEO === 'true' ? (

                            <SeoShare url={decodedURL} title={`${data?.data[0]?.title} - ${settingsData && settingsData?.data?.web_setting?.web_name}`} hashtag={`${settingsData && settingsData?.data?.web_setting?.web_name}`} />

                          ) :

                            <WithoutSeoShare url={decodedURL} />
                          }

                        </div>

                        <div className='relative'>
                          <Image src={data && data?.data[0]?.image} height={0} width={0} alt={data && data?.data[0]?.title} loading='lazy' className='h-auto w-full rounded-[10px] object-cover' onError={placeholderImage} />
                          <div className='absolute bottom-6 right-6'>
                            {galleryPhotos && galleryPhotos[0]?.images?.length > 0 ? (
                              <button onClick={() => openLightbox(0)} className='primaryBg py-2 px-4 rounded-sm'>
                                <FaImages size={25} style={{ color: '#fff' }} />
                              </button>
                            ) : null}
                          </div>
                          <LightBox
                            photos={galleryPhotos[0]?.images}
                            viewerIsOpen={viewerIsOpen}
                            currentImage={currentImage}
                            onClose={closeLightbox}
                            setCurrentImage={setCurrentImage}
                            title_image={data && data?.data[0]?.image}
                          />
                          {
                            data && data?.data[0]?.content_value &&
                            <VideoPlayerModal videoSect={true} keyboard={false} url={data && data?.data[0]?.content_value} type_url={data && data?.data[0]?.content_type} />
                          }
                        </div>

                        {/* Font Slider Section */}
                        <div className="border borderColor p-4 commonRadius">
                          <div className="grid grid-cols-12 gap-6">
                            <div className={`col-span-12 ${breakingNews ? "sm:col-span-12" : "sm:col-span-9"} fontRange`}>

                              <label className="text-lg font-[600] textPrimary">{translate('fontsize')}</label>
                              <Slider
                                defaultValue={[fontSize]} // initial value based on fontSize state
                                min={14} // Set minimum value to 14px
                                max={24} // max value of 24px
                                step={1}
                                onValueChange={(value) => setFontSize(value[0])} // update the fontSize state as slider changes
                                className="h-2 rounded-full !commonBg mt-2"
                                thumbClassName="!bg-primary rounded-full h-4 w-4 border-2 border-white"
                              />
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-sm font-[600] textPrimary">14px</span>
                                <span className="text-sm font-[600] textPrimary">16px</span>
                                <span className="text-sm font-[600] textPrimary">18px</span>
                                <span className="text-sm font-[600] textPrimary">20px</span>
                                <span className="text-sm font-[600] textPrimary">22px</span>
                                <span className="text-sm font-[600] textPrimary">24px</span>
                              </div>
                            </div>
                            {
                              !breakingNews &&
                              <div className="col-span-12  sm:col-span-3 flex items-center justify-around pl-6 mt-3 textPrimary">
                                <div className='flex flex-col gap-2 cursor-pointer font-[600]' onClick={() => handleBookamrkNews()}>
                                  {bookmark ? <BsFillBookmarkFill size={23} /> : <BsBookmark size={23} />}
                                  {translate('saveLbl')}
                                </div>
                                <div className='flex flex-col gap-2 cursor-pointer font-[600]' onClick={() => handleLikeNews()}>
                                  {
                                    like ?
                                      <AiFillLike size={23} /> :
                                      <AiOutlineLike size={23} />
                                  }

                                  {translate('likes')}
                                </div>
                              </div>
                            }

                          </div>

                        </div>
                        <div>
                          {/* Apply the dynamic font size using inline styles */}
                          <p className="textPrimary newsDesc" style={{ fontSize: `${fontSize}px`, wordWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: data && data?.data[0]?.description }}>
                          </p>
                        </div>

                        {
                          !breakingNews && data?.data[0]?.tag?.length > 0 &&
                          <div className='border-y borderColor flex items-center gap-4 py-4 flex-wrap'>
                            <div className='flex items-center gap-2'>
                              <GoTag />
                              {translate('tagLbl')} :
                            </div>
                            <div className='flex items-center gap-4 flex-wrap'>
                              {
                                data?.data[0]?.tag.map((tag, index) => {
                                  return <span
                                    key={index}
                                    className='secondaryBg text-white rounded-[6px] py-1 px-4 cursor-pointer'
                                    onClick={() => router.push(`/${currLangCode}/tag/${tag.slug}`)}
                                  >
                                    {tag.tag_name}
                                  </span>
                                })
                              }
                            </div>
                          </div>}

                        {
                          settingsData && settingsData?.data?.comments_mode === '1' && !breakingNews &&
                          <CommentSection newsId={data && data?.data?.[0]?.id} />
                        }

                      </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                      {
                        !breakingNews &&
                        <>
                          {
                            data && data?.data[0]?.category_id &&
                            <RelatedNewSections newsSlug={slug} categorySlug={data && data?.data[0]?.category?.slug}
                            />
                          }
                          <TagSection />

                          {
                            isLogin() && checkUserData(userData) &&
                            <SurveysSection />
                          }
                        </>
                      }
                    </div>
                  </div>
                </section>

                {/* ad spaces */}
                {adSpacesData && adSpacesData?.ad_spaces_bottom ? (
                  <div className='container mt-8 md:mt-12'>
                    <AdSpace ad_url={adSpacesData && adSpacesData?.ad_spaces_bottom.ad_url} ad_img={adSpacesData && adSpacesData?.ad_spaces_bottom.web_ad_image} style_web='' />
                  </div>
                ) : null}
              </>
              :
              !loading && !data?.data &&
              <NoDataFound />
        }
        <OpenInAppPopUp IsOpenInApp={IsOpenInApp} OnHide={() => setIsOpenInApp(false)} />
      </section>
    </Layout>
  )
}

export default NewsDetails
