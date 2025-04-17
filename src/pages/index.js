import axios from "axios";
import dynamic from "next/dynamic.js";
import Meta from "@/components/commonComponents/seo/Meta.jsx";
import { extractJSONFromMarkup } from "@/utils/helpers.jsx";
import generateRssFeed from "./api/rss.js";
import { GET_SETTINGS, GET_WEB_SEO_PAGES, GET_RSS_FEED } from "@/utils/api/api.js";
const HomePage = dynamic(() => import('../components/home/HomePage.jsx'), { ssr: false })

// This is settings api
const fetchSettings = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_SETTINGS}`
    )
    const data = response.data
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}
// This is seo api
const fetchDataFromSeo = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_WEB_SEO_PAGES}?type=home`
    )
    const data = response.data
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

const fetchFeeds = async (language_id) => {
  try {

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_RSS_FEED}?language_id=${language_id}`
    )
    const data = response.data;
    if (data) {
      await generateRssFeed(data);
    }

    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

export default function Home({ seoData, adsenseUrl, currentURL }) {

  const adsenseURL = adsenseUrl;

  let schema = null;

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
      <HomePage />
      {
        adsenseURL && adsenseURL !== null || adsenseURL && adsenseURL !== undefined || adsenseURL && adsenseURL?.length > 0 ?
          <script async src={adsenseURL}
            crossOrigin="anonymous"></script> : null
      }
    </>
  );

}


let serverSidePropsFunction = null
if (process.env.NEXT_PUBLIC_SEO === 'true') {
  serverSidePropsFunction = async context => {
    // Retrieve the slug from the URL query parameters
    const { req } = context // Extract query and request object from context

    const currentURL = req[Symbol.for('NextInternalRequestMeta')].initURL
    const seoData = await fetchDataFromSeo(req.url);
    const settingsData = await fetchSettings()


    const adsenseUrl = settingsData?.data?.web_setting?.google_adsense ? settingsData?.data?.web_setting?.google_adsense : null;

    if (settingsData) {
      const feeds = await fetchFeeds(settingsData?.data?.default_language?.id);
    }

    // Pass the fetched data as props to the page component
    return {
      props: {
        adsenseUrl,
        seoData,
        currentURL,
      }
    }
  }
}

export const getServerSideProps = serverSidePropsFunction