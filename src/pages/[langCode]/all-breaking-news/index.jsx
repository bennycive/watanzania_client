import Meta from '@/components/commonComponents/seo/Meta'
import { GET_WEB_SEO_PAGES } from '@/utils/api/api'
import { extractJSONFromMarkup } from '@/utils/helpers'
import axios from 'axios'
import dynamic from 'next/dynamic'

const AllBreakingNews = dynamic(() => import('../../../components/pagesComponent/AllBreakingNews.jsx'), { ssr: false })

// This is seo api
const fetchDataFromSeo = async (language_id) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_WEB_SEO_PAGES}?type=all_breaking_news&language_id=${language_id}`
    )
    const data = response.data
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

const Index = ({ seoData, currentURL }) => {
  let schema = null


  if (seoData && seoData.data && seoData.data.length > 0 && seoData.data[0].schema_markup) {
    const schemaString = seoData.data[0].schema_markup
    schema = extractJSONFromMarkup(schemaString)
  }
  return (
    <>
      <Meta
        title={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_title}
        description={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_description}
        keywords={seoData?.data && seoData.data.length > 0 && seoData.data[0].meta_keyword}
        ogImage={seoData?.data && seoData.data.length > 0 && seoData.data[0].image}
        pathName={currentURL}
        schema={schema}
      />
      <AllBreakingNews />
    </>
  )
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
  serverSidePropsFunction = async (context) => {
    const { req } = context; // Extract query and request object from context
    const { language_id } = req[Symbol.for('NextInternalRequestMeta')].initQuery;

    const currentURL = process.env.NEXT_PUBLIC_WEB_URL;
    const seoData = await fetchDataFromSeo(language_id);
    return {
      props: {
        seoData,
        currentURL,
      },
    };
  };
}

export const getServerSideProps = serverSidePropsFunction

export default Index
