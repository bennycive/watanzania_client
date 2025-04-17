import axios from 'axios'
import dynamic from 'next/dynamic'
import Meta from '../../../components/commonComponents/seo/Meta.jsx'
import { GET_NEWS } from '../../../utils/api/api.js'
import { extractJSONFromMarkup } from '@/utils/helpers.jsx'
const NewsDetails = dynamic(() => import('@/components/pagesComponent/NewsDetails'), { ssr: false })

// This is seo api
const fetchDataFromSeo = async (id, language_id) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_NEWS}?language_id=${language_id}&slug=${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const Index = ({ seoData, currentURL }) => {
  let schema = null;
  // console.log(seoData)
  if (seoData && seoData.data && seoData.data.length > 0 && seoData.data[0].schema_markup) {
    const schemaString = seoData.data[0].schema_markup;
    schema = extractJSONFromMarkup(schemaString);
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
      <NewsDetails />
    </>
  );
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
  serverSidePropsFunction = async (context) => {
    const { req } = context; // Extract query and request object from context
    // console.log(req)
    const { params } = req[Symbol.for('NextInternalRequestMeta')].match;
    // Accessing the slug property
    // const currentURL = req[Symbol.for('NextInternalRequestMeta')].__NEXT_INIT_URL;
    const slugValue = params.slug;
    const { language_id, langCode } = req[Symbol.for('NextInternalRequestMeta')].initQuery;
    const currentURL = process.env.NEXT_PUBLIC_WEB_URL + `${langCode}/news/` + slugValue + '/';
    const seoData = await fetchDataFromSeo(slugValue, language_id);
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