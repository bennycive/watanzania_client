'use client'
import Meta from '@/components/commonComponents/seo/Meta'
import { translate } from '@/utils/helpers'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const TagNewsview = dynamic(() => import('@/components/tag/TagNews.jsx'), { ssr: false })

const index = () => {

  const router = useRouter();

  const slug = router?.query?.slug

  const webName = process.env.NEXT_PUBLIC_WEB_NAME;

  return (
    <>
      <Meta title={`${webName} | ${translate('tagLbl')} ${slug ? `| ${slug}` : ''}`} description='' keywords='' ogImage='' pathName='' schema='' />
      <TagNewsview />
    </>
  )
}

export default index
