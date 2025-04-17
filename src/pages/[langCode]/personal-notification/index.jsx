'use client'
import Meta from '@/components/commonComponents/seo/Meta'
import { GET_WEB_SEO_PAGES } from '@/utils/api/api'
import { extractJSONFromMarkup, translate } from '@/utils/helpers'
import dynamic from 'next/dynamic'

const Notification = dynamic(() => import('@/components/pagesComponent/Notifications.jsx'), { ssr: false })


// This is seo api
const fetchDataFromSeo = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_WEB_SEO_PAGES}?type=personal_notifications`
    )
    const data = response.data
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}


const Index = (seoData, currentURL) => {

  let schema = null

  if (seoData && seoData.data && seoData.data.length > 0 && seoData.data[0].schema_markup) {
    const schemaString = seoData.data[0].schema_markup
    schema = extractJSONFromMarkup(schemaString)
  }

  const webName = process.env.NEXT_PUBLIC_WEB_NAME

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
      <Notification />
    </>
  )
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
  serverSidePropsFunction = async (context) => {
    const { req } = context; // Extract query and request object from context

    // const currentURL = `${req.headers.host}${req.url}`;
    const currentURL = process.env.NEXT_PUBLIC_WEB_URL + '/personal-notification/';
    const seoData = await fetchDataFromSeo(req.url);
    // Pass the fetched data as props to the Index component

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
