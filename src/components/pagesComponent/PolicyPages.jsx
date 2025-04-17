'use client'
import React, { useEffect, useState } from 'react'
// import { NoDataFound, translate } from 'src/utils/index.jsx'
// import { selectCurrentLanguage } from 'src/store/reducers/languageReducer.js'
import { useSelector } from 'react-redux'
import { getPolicyPagesApi } from '@/utils/api/api.js'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import { currentLanguageSelector } from '../store/reducers/languageReducer'
import { translate } from '@/utils/helpers'
import DetailPageSkeleton from '../skeletons/DetailPageSkeleton'

const PolicyPages = ({ privacyPolicyPage }) => {

  const [loading, setLoading] = useState(true)

  const [data, setData] = useState([])

  const currentLanguage = useSelector(currentLanguageSelector)

  // const currentLanguage = useSelector(selectCurrentLanguage)


  const fetchPolicyPages = async () => {
    try {
      setLoading(true)
      const { data } = await getPolicyPagesApi.getPolicyPages({
        language_id: currentLanguage?.id,
      });

      if (!data?.error) {
        setData(data)
      }
      else {
        console.log('error =>', data?.message)
        setData([])
      }
    } catch (error) {
      console.error('Error:', error);
      setData([])
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (currentLanguage?.id) {
      fetchPolicyPages()
    }
  }, [currentLanguage?.id])

  return (
    <Layout>
      <Breadcrumb secondElement={translate('policyPages')} thirdElement={privacyPolicyPage ? translate('priPolicy') : translate('termsandcondition')}
      />

      {
        loading ? <DetailPageSkeleton /> :

          <section className='morePagesSect container mt-8 md:mt-12 pb-1'>
            <div
              className='p-3 mb-0'
              dangerouslySetInnerHTML={{ __html: privacyPolicyPage ? data?.privacy_policy?.page_content : data?.terms_policy?.page_content }}
            ></div>
          </section>
      }
    </Layout >
  )
}

export default PolicyPages