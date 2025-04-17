'use client'
import Meta from '@/components/commonComponents/seo/Meta';
import { translate } from '@/utils/helpers.jsx';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
const SubCategory = dynamic(() => import('../../../../../components/pagesComponent/category/SubCategoryNews.jsx'), { ssr: false })

const index = () => {

  const webName = process.env.NEXT_PUBLIC_WEB_NAME;

  const router = useRouter();
  const query = router?.query
  const slug = query.slug

  return (
    <>
      <Meta title={`${webName} | ${translate('subcatLbl')}  ${slug ? `| ${slug}` : ''}`} description='' keywords='' ogImage='' pathName='' schema='' />
      <SubCategory />
    </>
  )
}

export default index
