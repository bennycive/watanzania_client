'use client'
import React, { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import CommonCardSkeleton from '../skeletons/CommonCardSkeleton'
import NewsCard from '../commonComponents/commonCards/NewsCard'
import { useRouter } from 'next/router'
import { getNewsApi } from '@/utils/api/api'
import { useSelector } from 'react-redux'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { NoDataFound, translate } from '@/utils/helpers'

const TagNews = () => {

  const currentLanguage = useSelector(currentLanguageSelector)

  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const slug = router?.query?.slug



  const [tagNews, setTagNews] = useState([])

  // api call
  const getNewsByTag = async () => {
    try {
      const { data } = await getNewsApi.getNews({
        tag_slug: slug,
        language_id: currentLanguage?.id,
      })

      if (!data?.error) {
        setTagNews(data?.data)
        setLoading(false)
      }
      else {
        setTagNews([])
        setLoading(false)
        console.log('error =>', data?.message)
      }

      return data
    } catch (error) {
      console.log(error)
      setTagNews([])
      setLoading(false)

    }
  }

  useEffect(() => {
    if (currentLanguage?.id) {
      getNewsByTag()
    }
  }, [currentLanguage?.id, slug])



  return (
    <Layout>
      <>
        <Breadcrumb secondElement={translate('tagLbl')} thirdElement={slug} />

        <section className='tagNews container mt-8 md:mt-12'>
          {
            loading ? <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10'>
              {[...Array(4)].map((_, index) => (
                <div key={index}>
                  <CommonCardSkeleton />
                </div>
              ))}
            </div>
              :
              tagNews && tagNews?.length > 0 ? <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10'>
                {
                  tagNews?.map((element) => {
                    return <NewsCard element={element} tagCard={true} />
                  })
                }

              </div> :
                <>
                  {NoDataFound()}
                </>
          }
        </section>
      </>
    </Layout>
  )
}

export default TagNews