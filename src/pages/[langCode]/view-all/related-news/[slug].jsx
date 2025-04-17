'use client'
import Meta from '@/components/commonComponents/seo/Meta'
import { translate } from '@/utils/helpers'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const AllRelatedNews = dynamic(() => import('@/components/relatedNews/AllRelatedNews.jsx'), { ssr: false })

const index = () => {

  const webName = process.env.NEXT_PUBLIC_WEB_NAME;
  
  const router = useRouter();

  const slug = router?.query?.slug

  return (
    <>
      <Meta title={`${webName} | ${translate('related-news')} ${slug ? `| ${slug}` : ''}`} description='' keywords='' ogImage='' pathName='' schema='' />
      <AllRelatedNews />
    </>
  )
}

export default index
