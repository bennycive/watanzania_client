import { settingsSelector } from '@/components/store/reducers/settingsReducer'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import defaultFavicon from '../../../../public/favicon.png'

const Meta = ({ title, description, keywords, ogImage, pathName, schema }) => {

  const settingsData = useSelector(settingsSelector);
  const favicon = settingsData?.data?.web_setting?.favicon_icon;

  return (
    <>
      <Head>
        {/* title */}
        <title>{title ? title : process.env.NEXT_PUBLIC_TITLE}</title>

        {/*<!-- Google / Search Engine Tags -->*/}
        <meta name='name' content={process.env.NEXT_PUBLIC_WEB_URL} />
        <meta name='description' content={description ? description : process.env.NEXT_PUBLIC_DESCRIPTION} />
        <meta name='keywords' content={keywords ? keywords : process.env.NEXT_PUBLIC_kEYWORDS} />
        <meta name='image' content={ogImage ? ogImage : null} />

        {/*<!-- Facebook Meta Tags -->*/}
        <meta property='og:title' content={title ? title : process.env.NEXT_PUBLIC_TITLE} />
        <meta property='og:description' content={description ? description : process.env.NEXT_PUBLIC_DESCRIPTION} />
        <meta property='og:image' content={ogImage ? ogImage : null} />
        <meta property='og:image:type' content='image/jpg' />
        <meta property='og:image:width' content='1080' />
        <meta property='og:image:height' content='608' />
        <meta property='og:url' content={pathName ? pathName : process.env.NEXT_PUBLIC_WEB_URL} />
        <meta property='og:type' content='website' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:site_name' content={process.env.NEXT_PUBLIC_WEB_URL} />

        {/*<!-- Twitter Meta Tags -->*/}
        <meta name='twitter:title' content={title ? title : process.env.NEXT_PUBLIC_TITLE} />
        <meta name='twitter:description' content={description ? description : process.env.NEXT_PUBLIC_DESCRIPTION} />
        <meta name='twitter:image' content={ogImage ? ogImage : null} />
        <meta name='twitter:card' content='summary_large_image' />

        {/* robot and cononical */}
        <link rel='canonical' href={`${process.env.NEXT_PUBLIC_WEB_URL}`} />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='robots' content='index, follow,max-snippet:-1,max-video-preview:-1,max-image-preview:large' />

        {
          process?.env?.NEXT_PUBLIC_SEO === 'false' &&
          <link rel="icon" href={favicon && favicon ? favicon : defaultFavicon.src} sizes="32x32" type="image/png" />
        }

        {/* schemas */}
        <script
          key='structured-data'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema ? schema : null) }}
        />
      </Head>
    </>
  )
}

export default Meta
