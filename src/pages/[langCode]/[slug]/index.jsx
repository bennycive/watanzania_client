import Meta from '@/components/commonComponents/seo/Meta';
import { GET_PAGES } from '@/utils/api/api';
import { extractJSONFromMarkup } from '@/utils/helpers';
import axios from 'axios'
import dynamic from 'next/dynamic'
const SocialPages = dynamic(() => import('@/components/commonComponents/SocialPages'), { ssr: false })

// This is seo api
const fetchDataFromSeo = async (slug, language_id) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_PAGES}?language_id=${language_id}&slug=${slug}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

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
      <SocialPages isAboutContactUsPage={true} />
    </>
  )
}

let serverSidePropsFunction = null;
if (process.env.NEXT_PUBLIC_SEO === "true") {
  serverSidePropsFunction = async (context) => {
    const { req } = context; // Extract query and request object from context
    const { params } = req[Symbol.for('NextInternalRequestMeta')].match;
    // Accessing the slug property
    // const currentURL = req[Symbol.for('NextInternalRequestMeta')].__NEXT_INIT_URL;
    const slugValue = params.slug;
    const { language_id } = req[Symbol.for('NextInternalRequestMeta')].initQuery;
    // const currentURL = `${req.headers.host}${req.url}`;
    const currentURL = process.env.NEXT_PUBLIC_WEB_URL + `/${slugValue}/`;
    const seoData = await fetchDataFromSeo(slugValue,language_id);
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
